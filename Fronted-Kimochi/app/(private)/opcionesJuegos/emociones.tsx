import React, { useState, useEffect, useRef } from "react";
import preguntasData from "../../../assets/data/preguntasEmociones.json";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import imageMap from "@/constants/emocionesMap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registrarRespuesta } from "@/constants/RegistrarRespuesta";

const COLORS = {
  purple: "#6a1b9a",
  yellow: "#FFB800",
  lavender: "#f3e5f5",
  white: "#FFFFFF",
  green: "#C8E6C9", // verde suave
  red: "#FFCDD2", // rojo claro
};

const EmocionesScreen = () => {
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
  const [mostrarBotonSiguiente, setMostrarBotonSiguiente] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  // Animación sencilla para las tarjetas de opción (scale al presionar)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateScaleIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const animateScaleOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const obtenerUsuarioGuardado = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("user");
        if (usuarioJSON) {
          const usuarioObj = JSON.parse(usuarioJSON);
          setUsuario(usuarioObj);
        }
      } catch (error) {
        console.error("Error al recuperar el usuario:", error);
      }
    };

    obtenerUsuarioGuardado();
  }, []);

  useEffect(() => {
    if (usuario) obtenerNivel(usuario.id_usuario);
  }, [usuario]);

  useEffect(() => {
    cargarPreguntas();
  }, [nivelActual]);

  const obtenerNivel = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/api/usuarios/${id}/nivel`
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
    setMostrarBotonSiguiente(false);
  };

  const handleOptionPress = (option: any) => {
    registrarRespuesta(
      "emociones",
      option.es_correcto,
      current.id_pregunta,
      option.opcion_texto
    );
    setSelectedOption(option.id_opcion);
    if (option.es_correcto) {
      setAnswerState("correcta");
      setFeedback(option.emocion?.descripcion || "¡Muy bien!");
      setMostrarBotonSiguiente(true);
    } else {
      setAnswerState("incorrecta");
      setFeedback("¡Ups! Intenta de nuevo.");
    }
  };

  const goToNextQuestion = () => {
    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next);
      setSelectedOption(null);
      setAnswerState(null);
      setFeedback("");
      setMostrarBotonSiguiente(false);
    } else {
      completarNivel();
    }
  };

  const completarNivel = async () => {
    if (!usuario) return;
    try {
      const siguienteNivel = nivelActual + 1;
      setNivelCompletadoMensaje(true);

      await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/api/usuarios/${usuario.id_usuario}/nivel-completado?nuevoNivel=${siguienteNivel}`,
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
      }, 2000);
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
        <Text style={styles.bigTitle}>🎉 ¡Nivel {nivelActual} completado!</Text>
      </View>
    );
  }

  if (!usuario || questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Cargando nivel {nivelActual}...</Text>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.centered}>
        <Text style={styles.bigTitle}>
          🎉 ¡Has completado todos los niveles!
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={restartGame}>
          <Ionicons name="refresh" size={20} color={COLORS.purple} />
          <Text style={styles.ctaText}>Volver a empezar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = questions[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavender }}>
      <View style={styles.container}>
        <Text style={styles.title}>Nivel {nivelActual}</Text>
        <Text style={styles.question}>{current.pregunta}</Text>

        {/* Tarjetas de opciones */}
        <View style={styles.optionsContainer}>
          {current.opciones.map((option: any) => {
            const isSelected = option.id_opcion === selectedOption;
            const correct = answerState === "correcta" && isSelected;
            const incorrect = answerState === "incorrecta" && isSelected;

            const borderColor = correct
              ? COLORS.green
              : incorrect
              ? COLORS.red
              : COLORS.purple;

            return (
              <Animated.View
                key={option.id_opcion}
                style={{ transform: [{ scale: scaleAnim }] }}
              >
                <TouchableOpacity
                  style={[styles.option, { borderColor }]}
                  onPressIn={animateScaleIn}
                  onPressOut={animateScaleOut}
                  onPress={() => handleOptionPress(option)}
                  disabled={answerState === "correcta"}
                  activeOpacity={0.9}
                >
                  {option.emocion?.imagen_local && (
                    <Image
                      source={imageMap[option.emocion.imagen_local]}
                      style={styles.image}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Feedback visual */}
        {answerState && (
          <View
            style={[
              styles.feedbackCard,
              {
                backgroundColor:
                  answerState === "correcta" ? COLORS.green : COLORS.red,
              },
            ]}
          >
            <Ionicons
              name={
                answerState === "correcta" ? "checkmark-circle" : "close-circle"
              }
              size={24}
              color={COLORS.purple}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        {/* Botón siguiente */}
        {mostrarBotonSiguiente && (
          <TouchableOpacity style={styles.ctaButton} onPress={goToNextQuestion}>
            <Ionicons name="arrow-forward" size={20} color={COLORS.purple} />
            <Text style={styles.ctaText}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const isTablet = width > 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 0 : 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lavender,
    padding: 20,
  },
  title: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.purple,
    marginBottom: 18,
  },
  bigTitle: {
    fontSize: isTablet ? 32 : 26,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.purple,
    marginBottom: 24,
  },
  question: {
    fontSize: isTablet ? 24 : 18,
    textAlign: "center",
    color: COLORS.purple,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 18,
    marginBottom: 24,
    alignItems: "center",
  },
  option: {
    borderWidth: 3,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    height: isTablet ? 350 : 150,
    width: isTablet ? 900 : 320,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: isTablet ? 260 : 180,
    height: isTablet ? 220 : 150,
    resizeMode: "contain",
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  feedbackText: {
    fontSize: 16,
    color: COLORS.purple,
    fontWeight: "bold",
    textAlign: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: COLORS.yellow,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  ctaText: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },
});

export default EmocionesScreen;
