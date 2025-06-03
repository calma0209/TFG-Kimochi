import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

type Entrada = {
  id_registro: number;
  fecha_registro: string;
  nota: string;
  emocion: {
    id_emocion: number;
    nombre: string;
    imagen_url: string;
  };
};

type Emocion = {
  id_emocion: number;
  nombre: string;
  imagen_url: string;
};

const DiarioEmociones = () => {
  const [texto, setTexto] = useState("");
  const [emociones, setEmociones] = useState<Emocion[]>([]);
  const [emocionSeleccionada, setEmocionSeleccionada] = useState<number | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [entradaSeleccionada, setEntradaSeleccionada] =
    useState<Entrada | null>(null);
  const [entradas, setEntradas] = useState<Entrada[]>([]);

  const idUsuario = 18;

  //para que la pantalla no vuelva atrás al presionar el botón de atrás (Android)
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/(private)/(tabs)/dashboard");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  const eliminarEntrada = async (id: number) => {
    try {
      await fetch(`http://192.168.1.135:8080/api/diario/eliminar/${id}`, {
        method: "DELETE",
      });
      alert("Entrada eliminada");
      obtenerEntradas();
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
    }
  };

  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const obtenerEmociones = async () => {
    try {
      const res = await fetch("http://192.168.1.135:8080/api/emociones");
      const data = await res.json();
      setEmociones(data);
    } catch (error) {
      console.error("Error al cargar emociones:", error);
    }
  };

  const obtenerEntradas = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.135:8080/api/diario/usuario/${idUsuario}`
      );
      const data = await res.json();
      setEntradas(
        data.sort(
          (a: Entrada, b: Entrada) =>
            new Date(b.fecha_registro).getTime() -
            new Date(a.fecha_registro).getTime()
        )
      );
    } catch (error) {
      console.error("Error al cargar entradas:", error);
    }
  };

  const handleGuardar = async () => {
    try {
      if (!emocionSeleccionada) {
        alert("Selecciona una emoción antes de guardar.");
        return;
      }
      if (!texto.trim()) {
        alert("Escribe cómo te sientes antes de guardar.");
        return;
      }

      await fetch(`http://192.168.1.135:8080/api/diario/crear/${idUsuario}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nota: texto,
          emocion: { id_emocion: emocionSeleccionada },
        }),
      });

      alert("Entrada guardada");
      setTexto("");
      setEmocionSeleccionada(null);
      obtenerEntradas();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  useEffect(() => {
    obtenerEntradas();
    obtenerEmociones();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{fechaActual}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>
              ¿Qué emoción representa hoy tu día?
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 0 }}
            >
              {emociones.map((emocion) => (
                <TouchableOpacity
                  key={emocion.id_emocion}
                  onPress={() => setEmocionSeleccionada(emocion.id_emocion)}
                  style={[
                    styles.emocionBox,
                    emocionSeleccionada === emocion.id_emocion &&
                      styles.emocionSeleccionada,
                  ]}
                >
                  <Image
                    source={{ uri: emocion.imagen_url }}
                    style={styles.imagenEmocion}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>¿Cómo te sientes hoy?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escribe tu entrada aquí..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              value={texto}
              onChangeText={setTexto}
            />
            <TouchableOpacity style={styles.button} onPress={handleGuardar}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <SwipeListView
                data={entradas}
                keyExtractor={(item) => item.id_registro.toString()}
                renderItem={({ item }) => (
                  <View style={styles.rowFront}>
                    <TouchableOpacity
                      style={styles.fila}
                      onPress={() => {
                        setEntradaSeleccionada(item);
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: item.emocion.imagen_url }}
                        style={{ width: 25, height: 25, marginRight: 10 }}
                      />
                      <Text style={styles.columnaFecha}>
                        {new Date(item.fecha_registro).toLocaleDateString(
                          "es-ES"
                        )}
                      </Text>
                      <Text numberOfLines={1} style={styles.columnaTexto}>
                        {item.nota}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                renderHiddenItem={({ item }) => (
                  <View style={styles.rowBack}>
                    <TouchableOpacity
                      style={[
                        styles.botonOculto,
                        { backgroundColor: "#ff9800" },
                      ]}
                      onPress={() => {
                        setTexto(item.nota);
                        setEmocionSeleccionada(item.emocion.id_emocion);
                      }}
                    >
                      <Text style={styles.textoBoton}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.botonOculto,
                        { backgroundColor: "#f44336" },
                      ]}
                      onPress={() => eliminarEntrada(item.id_registro)}
                    >
                      <Text style={styles.textoBoton}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}
                rightOpenValue={-160}
                disableRightSwipe
              />
            </View>

            <Modal
              isVisible={modalVisible}
              onBackdropPress={() => setModalVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 20,
                }}
              >
                {entradaSeleccionada && (
                  <>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      {new Date(
                        entradaSeleccionada.fecha_registro
                      ).toLocaleDateString("es-ES")}
                    </Text>
                    <Image
                      source={{ uri: entradaSeleccionada.emocion.imagen_url }}
                      style={{ width: 50, height: 50, marginVertical: 10 }}
                    />
                    <Text style={{ fontSize: 16 }}>
                      {entradaSeleccionada.nota}
                    </Text>
                  </>
                )}
              </View>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default DiarioEmociones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#FFB800",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  headerText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  textArea: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f4f4f4",
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6a1b9a",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  columnaFecha: {
    flex: 1,
    fontWeight: "bold",
    color: "#444",
  },
  columnaTexto: {
    flex: 2,
    color: "#555",
  },
  emocionBox: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emocionSeleccionada: {
    borderColor: "#9c27b0",
    borderWidth: 2,
  },
  imagenEmocion: {
    width: 70,
    height: 70,
  },
  rowFront: {
    backgroundColor: "#fff",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#ddd",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
    borderRadius: 10,
  },
  botonOculto: {
    width: 65,
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 10,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});
