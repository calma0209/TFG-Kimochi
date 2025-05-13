import React, { useState, useEffect } from "react";
import preguntas from "../../assets/data/preguntas.json";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";

// Componente principal
const EmpatiaScreen = () => {
  // Estados para gestionar el juego
  const [questions, setQuestions] = useState<any[]>([]); // Lista de preguntas
  const [currentIndex, setCurrentIndex] = useState(0); // Pregunta actual
  const [selectedOption, setSelectedOption] = useState<number | null>(null); // Opción seleccionada
  const [answerState, setAnswerState] = useState<
    "correcta" | "incorrecta" | null
  >(null); // Si fue correcta o incorrecta
  const [feedback, setFeedback] = useState<string>(""); // Mensaje de feedback
  const [gameOver, setGameOver] = useState(false); // Si terminó el juego

  // Hook que se ejecuta al cargar la pantalla
  useEffect(() => {
    setQuestions(preguntas);
  }, []);

  // Cuando se pulsa una opción
  const handleOptionPress = (option: any) => {
    setSelectedOption(option.id_opcion); // Marcar la opción elegida

    if (option.es_correcto) {
      setFeedback("¡Respuesta correcta!");
      setAnswerState("correcta");
      // Avanza a la siguiente pregunta después de 2 segundos
      setTimeout(() => {
        goToNextQuestion();
      }, 2000);
    } else {
      setFeedback("Respuesta incorrecta. ¡Inténtalo de nuevo!");
      setAnswerState("incorrecta");
    }
  };

  // Avanzar a la siguiente pregunta
  const goToNextQuestion = () => {
    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next); // Mostrar siguiente
      setSelectedOption(null);
      setAnswerState(null);
      setFeedback("");
    } else {
      setGameOver(true); // Si no hay más, fin del juego
    }
  };

  // Reinicia el juego desde el principio
  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerState(null);
    setFeedback("");
    setGameOver(false);
  };

  // Mientras se cargan las preguntas
  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Cargando preguntas...</Text>
      </View>
    );
  }

  // Si el juego ha terminado
  if (gameOver) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>🎉 ¡Fin del juego!</Text>
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Volver a jugar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pregunta actual
  const current = questions[currentIndex];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Juego de Empatía</Text>
      <Text style={styles.question}>{current.pregunta}</Text>

      {/* Opciones para la pregunta actual */}
      <View style={styles.optionsContainer}>
        {current.opciones.map(
          (option: {
            id_opcion: React.Key | null | undefined;
            emocion: { imagen_url: any };
            opcion_texto:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
          }) => {
            // Color del borde según estado de respuesta
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
                disabled={answerState === "correcta"} // Desactiva si ya acertó
              >
                {/* Mostrar imagen si existe */}
                {option.emocion?.imagen_url && (
                  <Image
                    source={{ uri: option.emocion.imagen_url }}
                    style={styles.image}
                  />
                )}
                {/* Texto de la opción */}
                <Text style={styles.optionText}>{option.opcion_texto}</Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* Mensaje de feedback */}
      {feedback !== "" && <Text style={styles.feedback}>{feedback}</Text>}
    </ScrollView>
  );
};

// 🔧 Estilos responsive según el ancho del dispositivo
const { width } = Dimensions.get("window");
const isTablet = width > 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 40 : 30,
    backgroundColor: "#fff",
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
  question: {
    fontSize: isTablet ? 22 : 18,
    textAlign: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 20,
    alignItems: "center",
  },
  option: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "90%",
    backgroundColor: "#f8f8f8",
  },
  optionText: {
    fontSize: isTablet ? 18 : 16,
    marginTop: 10,
    textAlign: "center",
  },
  image: {
    width: isTablet ? 160 : 120,
    height: isTablet ? 200 : 150,
    resizeMode: "contain",
  },
  feedback: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#333",
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
