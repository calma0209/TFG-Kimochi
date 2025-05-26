import React, { useState, useEffect } from "react";
import preguntasData from "../../assets/data/preguntas.json";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import imageMap from "@/constants/emocionesMap";

const EmpatiaScreen = () => {
  const [nivelActual, setNivelActual] = useState(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<
    "correcta" | "incorrecta" | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [nivelCompletadoMensaje, setNivelCompletadoMensaje] = useState(false);

  const usuarioId = 27;

  useEffect(() => {
    obtenerNivel();
  }, []);

  useEffect(() => {
    cargarPreguntas();
  }, [nivelActual]);

  const obtenerNivel = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.38:8080/api/usuarios/${usuarioId}/nivel`
      );
      const nivel = await res.json();
      if (nivel > 0) setNivelActual(nivel);
    } catch (error) {
      console.error("Error obteniendo nivel:", error);
    }
  };

  const cargarPreguntas = () => {
    const preguntasNivel =
      (preguntasData as any)[`nivel_${nivelActual}`]?.preguntas || [];
    setQuestions(preguntasNivel);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerState(null);
    setFeedback("");
  };

  const handleOptionPress = (option: any) => {
    setSelectedOption(option.id_opcion);
    if (option.es_correcto) {
      setFeedback("¡Respuesta correcta!");
      setAnswerState("correcta");
      setTimeout(() => {
        goToNextQuestion();
      }, 1500);
    } else {
      setFeedback("Respuesta incorrecta. ¡Inténtalo de nuevo!");
      setAnswerState("incorrecta");
    }
  };

  const goToNextQuestion = () => {
    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next);
      setSelectedOption(null);
      setAnswerState(null);
      setFeedback("");
    } else {
      completarNivel();
    }
  };

  const completarNivel = async () => {
    try {
      const siguienteNivel = nivelActual + 1;

      setNivelCompletadoMensaje(true); // Mostrar mensaje

      await fetch(
        `http://192.168.1.38:8080/api/usuarios/${usuarioId}/nivel-completado?nuevoNivel=${siguienteNivel}`,
        { method: "POST" }
      );

      setTimeout(() => {
        const haySiguiente = (preguntasData as any)[`nivel_${siguienteNivel}`];
        if (haySiguiente) {
          setNivelActual(siguienteNivel);
        } else {
          setGameOver(true);
        }
        setNivelCompletadoMensaje(false);
      }, 2000); // Mostrar 2 segundos
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el nivel y la recompensa");
    }
  };

  const restartGame = () => {
    setNivelActual(1);
    setGameOver(false);
  };

  if (nivelCompletadoMensaje) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>
          🎉 ¡Felicidades! Has completado el Nivel {nivelActual}
        </Text>
        <Text style={styles.subtitle}>
          Tienes la insignia de nivel {nivelActual} ¡Felicidades!
        </Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Cargando preguntas del nivel {nivelActual}...</Text>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>🎉 ¡Has completado todos los niveles!</Text>
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Volver a empezar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = questions[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(tabs)/opcionesJuegos")}
        >
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Nivel {nivelActual}</Text>
        <Text style={styles.question}>{current.pregunta}</Text>

        <View style={styles.optionsContainer}>
          {current.opciones.map((option: any) => {
            let borderColor = "#ccc";
            if (option.id_opcion === selectedOption) {
              borderColor =
                answerState === "correcta"
                  ? "green"
                  : answerState === "incorrecta"
                  ? "red"
                  : "#6a1b9a";
            }

            return (
              <TouchableOpacity
                key={option.id_opcion}
                style={[styles.option, { borderColor }]}
                onPress={() => handleOptionPress(option)}
                disabled={answerState === "correcta"}
              >
                {option.emocion?.imagen_local && (
                  <Image
                    source={imageMap[option.emocion.imagen_local]}
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {feedback !== "" && <Text style={styles.feedback}>{feedback}</Text>}
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const isTablet = width > 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 40 : 30,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  backText: {
    fontSize: 28,
    color: "#6a1b9a",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6a1b9a",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: isTablet ? 20 : 16,
    textAlign: "center",
    color: "#333",
  },
  question: {
    fontSize: isTablet ? 22 : 18,
    textAlign: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 20,
    margin: isTablet ? 10 : 15,
    paddingBottom: isTablet ? 10 : 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  option: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    height: isTablet ? 350 : 150,
    width: isTablet ? 950 : 350,
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: isTablet ? 250 : 180,
    height: isTablet ? 200 : 150,
    resizeMode: "contain",
  },
  feedback: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6a1b9a",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmpatiaScreen;
