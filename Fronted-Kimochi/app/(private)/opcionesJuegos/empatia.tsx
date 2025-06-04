import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import preguntasJSON from "@/assets/data/preguntasEmpatia.json";
import imageMap from "@/constants/emocionesMap"; // usa la misma lógica de mapeo de imágenes que en Emociones

/***************************
 * 🎨  PALETA DE COLORES  *
 ***************************/
const COLORS = {
  purple: "#6a1b9a",
  yellow: "#FFB800",
  lavender: "#f3e5f5",
  white: "#FFFFFF",
  green: "#C8E6C9", // verde suave
  red: "#FFCDD2", // rojo claro
};

interface Opcion {
  texto: string;
  es_correcta: boolean;
  reflexion: string;
}

interface Pregunta {
  situacion: string;
  imagen?: string;
  opciones: Opcion[];
}

const barajar = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

const EmpatiaScreen: React.FC = () => {
  // Estado principal
  const [preguntas] = useState<Pregunta[]>(
    barajar(preguntasJSON as Pregunta[])
  );
  const [indice, setIndice] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<Opcion | null>(
    null
  );

  const preguntaActual = preguntas[indice];
  const correcta = opcionSeleccionada?.es_correcta ?? false;

  /* -------------------------
   * 🎞️  ANIMACIÓN OPCIONES
   * ------------------------- */
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animar = () => {
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  };

  /* -------------------------
   * 🎯  HANDLERS
   * ------------------------- */
  const manejarRespuesta = (op: Opcion) => {
    if (opcionSeleccionada) return;
    setOpcionSeleccionada(op);
  };

  const siguiente = () => {
    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
      setOpcionSeleccionada(null);
    } else {
      // reiniciar juego
      setIndice(0);
      setOpcionSeleccionada(null);
    }
  };

  const reintentar = () => setOpcionSeleccionada(null);

  return (
    <SafeAreaView style={styles.containerSafe}>
      <View style={styles.container}>
        {/* Imagen de la situación */}
        {preguntaActual.imagen && (
          <Image
            source={imageMap[preguntaActual.imagen]}
            style={styles.imagen}
          />
        )}

        {/* Texto de la situación */}
        <Text style={styles.situacion}>{preguntaActual.situacion}</Text>

        {/* Opciones */}
        <View style={styles.grid}>
          {preguntaActual.opciones.map((op, idx) => (
            <OptionCard
              key={idx}
              opcion={op}
              deshabilitado={!!opcionSeleccionada}
              onPress={() => manejarRespuesta(op)}
            />
          ))}
        </View>

        {/* Feedback */}
        {opcionSeleccionada && (
          <>
            <View
              style={[
                styles.feedbackCard,
                { backgroundColor: correcta ? COLORS.green : COLORS.red },
              ]}
            >
              <Text style={styles.feedbackText}>
                {opcionSeleccionada.reflexion}
              </Text>
            </View>

            {/* Botón acción */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={correcta ? siguiente : reintentar}
              activeOpacity={0.8}
            >
              <Ionicons
                name={correcta ? "arrow-forward" : "refresh"}
                size={24}
                color={COLORS.purple}
              />
              <Text style={styles.nextText}>
                {correcta ? "Siguiente" : "Reintentar"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

/***************************
 * 📦  COMPONENTE OPCIÓN
 ***************************/
interface OptionCardProps {
  opcion: Opcion;
  deshabilitado: boolean;
  onPress: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  opcion,
  deshabilitado,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    scale.setValue(1);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (deshabilitado) return;
    pulse();
    onPress();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.cardTouchable}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <Text style={styles.cardText}>{opcion.texto}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

/***************************
 * 💅  ESTILOS
 ***************************/
const { width } = Dimensions.get("window");
const isTablet = width > 600;

const styles = StyleSheet.create({
  containerSafe: {
    flex: 1,
    backgroundColor: COLORS.lavender,
  },
  container: {
    flex: 1,
    padding: isTablet ? 40 : 20,
    alignItems: "center",
  },
  imagen: {
    width: isTablet ? 250 : 180,
    height: isTablet ? 200 : 150,
    resizeMode: "contain",
  },
  situacion: {
    fontSize: isTablet ? 22 : 18,
    textAlign: "center",
    marginVertical: 16,
    fontWeight: "700",
    color: COLORS.purple,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.purple,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTouchable: {
    paddingVertical: isTablet ? 18 : 14,
    paddingHorizontal: isTablet ? 28 : 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: width / 2.4,
  },
  cardText: {
    fontSize: isTablet ? 20 : 16,
    color: COLORS.purple,
    fontWeight: "600",
    textAlign: "center",
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.purple,
    textAlign: "center",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 24,
  },
  nextText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.purple,
  },
});

export default EmpatiaScreen;
