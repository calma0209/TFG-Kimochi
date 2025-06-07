import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import preguntasJSON from "@/assets/data/preguntasComoMeSiento.json";
import imageMap from "@/constants/emocionesMap";
import AsyncStorage from "@react-native-async-storage/async-storage";

/***************************
 * 🎨  PALETA DE COLORES  *
 ***************************/
const COLORS = {
  purple: "#6a1b9a",
  yellow: "#FFB800",
  lavender: "#f3e5f5",
  white: "#FFFFFF",
};

const ComoMeSientoScreen = () => {
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<
    string | null
  >(null);
  const [feedback, setFeedback] = useState<string>("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarBotonSiguiente, setMostrarBotonSiguiente] = useState(false);

  // Animación de scale al tocar una tarjeta
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateScaleIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.93,
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

  /* -------------------------
   * 🚀  INICIAR JUEGO
   * ------------------------- */
  useEffect(() => {
    iniciarJuego();
  }, []);

  const iniciarJuego = () => {
    const barajadas = shuffleArray([...preguntasJSON]);
    setPreguntas(barajadas);
    setCurrentIndex(0);
    setRespuestaSeleccionada(null);
    setFeedback("");
    setJuegoTerminado(false);
    setMostrarBotonSiguiente(false);
  };

  const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

  const manejarRespuesta = (opcion: any) => {
    setRespuestaSeleccionada(opcion.texto);
    setMostrarBotonSiguiente(true);
    setFeedback(opcion.reflexion);
  };

  const avanzar = async () => {
    const siguiente = currentIndex + 1;
    if (siguiente < preguntas.length) {
      setCurrentIndex(siguiente);
      setRespuestaSeleccionada(null);
      setFeedback("");
      setMostrarBotonSiguiente(false);
    } else {
      // 👇 Juego terminado → Dar recompensa
      const userRaw = await AsyncStorage.getItem("user");
      const user = JSON.parse(userRaw || "{}");
      const userId = user.id_usuario;
      if (userId) {
        fetch(
          `${process.env.EXPO_PUBLIC_API_BASE}/api/usuarios/${userId}/monedas/sumar?cantidad=100`,
          {
            method: "POST",
          }
        ).catch((err) => console.error("Error al sumar monedas:", err));
      }

      setJuegoTerminado(true);
    }
  };

  /*********************************
   * 🎉  ESTADOS INTERMEDIOS
   *********************************/
  if (preguntas.length === 0) return null;

  if (juegoTerminado) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.bigTitle}>🎉 ¡Fin del juego!</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={iniciarJuego}>
          <Ionicons name="refresh" size={20} color={COLORS.purple} />
          <Text style={styles.ctaText}>Volver a jugar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const preguntaActual = preguntas[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavender }}>
      <View style={styles.container}>
        {/* Imagen principal */}
        {preguntaActual.imagen && (
          <Image
            source={imageMap[preguntaActual.imagen]}
            style={styles.imagen}
          />
        )}

        {/* Situación */}
        <Text style={styles.situacion}>{preguntaActual.situacion}</Text>

        {/* Opciones */}
        <View style={styles.grid}>
          {preguntaActual.opciones.map((opcion: any, idx: number) => {
            const seleccionado = opcion.texto === respuestaSeleccionada;
            const borderColor = seleccionado ? COLORS.yellow : COLORS.purple;

            return (
              <Animated.View
                key={idx}
                style={{ transform: [{ scale: scaleAnim }] }}
              >
                <TouchableOpacity
                  style={[styles.opcion, { borderColor }]}
                  onPressIn={animateScaleIn}
                  onPressOut={animateScaleOut}
                  onPress={() => manejarRespuesta(opcion)}
                  disabled={!!respuestaSeleccionada}
                  activeOpacity={0.9}
                >
                  <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Feedback reflexión */}
        {feedback !== "" && (
          <View style={styles.feedbackCard}>
            <Ionicons
              name="bulb"
              size={24}
              color={COLORS.purple}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        {/* Botón siguiente */}
        {mostrarBotonSiguiente && (
          <TouchableOpacity style={styles.ctaButton} onPress={avanzar}>
            <Ionicons name="arrow-forward" size={20} color={COLORS.purple} />
            <Text style={styles.ctaText}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

/***************************
 * 💅  ESTILOS
 ***************************/
const { width } = Dimensions.get("window");
const isTablet = width > 700;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 40 : 24,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lavender,
    padding: 20,
  },
  bigTitle: {
    fontSize: isTablet ? 32 : 26,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.purple,
    marginBottom: 24,
  },
  imagen: {
    width: isTablet ? 260 : 180,
    height: isTablet ? 220 : 150,
    resizeMode: "contain",
  },
  situacion: {
    fontSize: isTablet ? 22 : 18,
    textAlign: "center",
    marginBottom: 26,
    fontWeight: "bold",
    color: COLORS.purple,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 18,
  },
  opcion: {
    width: width / 2.4,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 3,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  opcionTexto: {
    fontSize: isTablet ? 20 : 16,
    textAlign: "center",
    color: COLORS.purple,
    fontWeight: "600",
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: COLORS.yellow,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 26,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  feedbackText: {
    fontSize: 16,
    color: COLORS.purple,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: width * 0.8,
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
    marginTop: 28,
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

export default ComoMeSientoScreen;
