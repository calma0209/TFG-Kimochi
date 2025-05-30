import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import preguntasJSON from "@/assets/data/preguntasEmpatia.json";
import imageMap from "@/constants/emocionesMap";

const EmpatiaSituacional = () => {
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<
    string | null
  >(null);
  const [feedback, setFeedback] = useState<string>("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);

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
  };

  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const manejarRespuesta = (opcion: any) => {
    setRespuestaSeleccionada(opcion.texto);
    setFeedback(opcion.es_correcta ? "¡Correcto!" : "Incorrecto.");

    setTimeout(() => {
      const siguiente = currentIndex + 1;
      if (siguiente < preguntas.length) {
        setCurrentIndex(siguiente);
        setRespuestaSeleccionada(null);
        setFeedback("");
      } else {
        setJuegoTerminado(true);
      }
    }, 2000);
  };

  if (preguntas.length === 0) return null;
  if (juegoTerminado) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text style={styles.title}>🎉 ¡Fin del juego!</Text>
        <TouchableOpacity style={styles.button} onPress={iniciarJuego}>
          <Text style={styles.buttonText}>Volver a jugar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const preguntaActual = preguntas[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        {/* Imagen opcional */}
        {preguntaActual.imagen && (
          <Image
            source={imageMap[preguntaActual.imagen]}
            style={styles.imagen}
          />
        )}

        <Text style={styles.situacion}>{preguntaActual.situacion}</Text>

        <View style={styles.grid}>
          {preguntaActual.opciones.map((opcion: any, idx: number) => {
            const seleccionado = opcion.texto === respuestaSeleccionada;
            const color = seleccionado
              ? opcion.es_correcta
                ? "green"
                : "red"
              : "#ccc";

            return (
              <TouchableOpacity
                key={idx}
                style={[styles.opcion, { borderColor: color }]}
                onPress={() => manejarRespuesta(opcion)}
                disabled={!!respuestaSeleccionada}
              >
                <Text style={styles.opcionTexto}>{opcion.texto}</Text>
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
    padding: isTablet ? 40 : 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  imagen: {
    width: isTablet ? 250 : 180,
    height: isTablet ? 200 : 150,
    resizeMode: "contain",
  },
  situacion: {
    fontSize: isTablet ? 22 : 18,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  opcion: {
    width: width / 2.5,
    paddingVertical: 15,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    margin: 10,
    backgroundColor: "#f0f0f0",
  },
  opcionTexto: {
    fontSize: isTablet ? 20 : 16,
    textAlign: "center",
  },
  feedback: {
    fontSize: 20,
    marginTop: 30,
    color: "#6a1b9a",
    fontWeight: "bold",
  },
  title: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6a1b9a",
    marginBottom: 20,
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

export default EmpatiaSituacional;
