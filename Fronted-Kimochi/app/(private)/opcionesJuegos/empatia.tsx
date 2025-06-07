import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import preguntasJSON from "@/assets/data/preguntasEmpatia.json";
import imageMap from "@/constants/emocionesMap";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  purple: "#6a1b9a",
  yellow: "#FFB800",
  lavender: "#f3e5f5",
  white: "#FFFFFF",
  green: "#C8E6C9",
  red: "#FFCDD2",
};

const EmpatiaScreen = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 700;

  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<
    any | null
  >(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateOption = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* -------------------------
   * 🎯  HANDLERS
   * ------------------------- */
  type Opcion = {
    texto: string;
    es_correcta: boolean;
    reflexion: string;
  };

  const manejarRespuesta = async (op: Opcion) => {
    if (respuestaSeleccionada) return;
    setRespuestaSeleccionada(op);
    //opcion correcta
    if (op.es_correcta) {
      const userRaw = await AsyncStorage.getItem("user");
      const user = JSON.parse(userRaw || "{}");
      const userId = user?.id_usuario;

      if (userId) {
        fetch(
          `${process.env.EXPO_PUBLIC_API_BASE}/api/usuarios/${userId}/monedas/sumar?cantidad=5`,
          {
            method: "POST",
          }
        ).catch((err) => console.error("Error al sumar monedas:", err));
      }
    }
  };

  const avanzar = () => {
    const siguiente = currentIndex + 1;
    if (siguiente < preguntas.length) {
      setCurrentIndex(siguiente);
      setRespuestaSeleccionada(null);
    } else {
      setCurrentIndex(0);
      setRespuestaSeleccionada(null);
    }
  };

  if (preguntas.length === 0) return null;

  const preguntaActual = preguntas[currentIndex];
  const correcta = respuestaSeleccionada?.es_correcta;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavender }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={[
            styles.container,
            { minHeight: height - 40, justifyContent: "space-evenly" },
          ]}
        >
          {preguntaActual.imagen && (
            <Image
              source={imageMap[preguntaActual.imagen]}
              style={[
                styles.imagen,
                { width: isTablet ? 260 : 180, height: isTablet ? 220 : 150 },
              ]}
            />
          )}

          <Text style={[styles.situacion, { fontSize: isTablet ? 22 : 18 }]}>
            {preguntaActual.situacion}
          </Text>

          <View style={styles.grid}>
            {preguntaActual.opciones.map((opcion: any, idx: number) => {
              const seleccionado =
                respuestaSeleccionada?.texto === opcion.texto;
              const borderColor = seleccionado ? COLORS.yellow : COLORS.purple;
              return (
                <Animated.View
                  key={idx}
                  style={{ transform: [{ scale: scaleAnim }] }}
                >
                  <TouchableOpacity
                    style={[
                      styles.opcion,
                      { borderColor, minWidth: width / 2.4 },
                    ]}
                    onPress={() => manejarRespuesta(opcion)}
                    disabled={!!respuestaSeleccionada}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.opcionTexto,
                        { fontSize: isTablet ? 20 : 16 },
                      ]}
                    >
                      {opcion.texto}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {respuestaSeleccionada && (
            <>
              <View
                style={[
                  styles.feedbackCard,
                  { backgroundColor: correcta ? COLORS.green : COLORS.red },
                ]}
              >
                <Ionicons
                  name={correcta ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={COLORS.purple}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.feedbackText}>
                  {respuestaSeleccionada.reflexion}
                </Text>
              </View>

              <TouchableOpacity style={styles.ctaButton} onPress={avanzar}>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={COLORS.purple}
                />
                <Text style={styles.ctaText}>Siguiente</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  imagen: {
    resizeMode: "contain",
  },
  situacion: {
    textAlign: "center",
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
    margin: 6,
  },
  opcionTexto: {
    textAlign: "center",
    color: COLORS.purple,
    fontWeight: "600",
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
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
    marginTop: 20,
  },
  ctaText: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },
});

export default EmpatiaScreen;
