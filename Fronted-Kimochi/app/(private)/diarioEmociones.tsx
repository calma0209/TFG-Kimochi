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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const [usuario, setUsuario] = useState<any>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("user");
        if (usuarioJSON) {
          const usuarioObj = JSON.parse(usuarioJSON);
          setUsuario(usuarioObj);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    obtenerUsuario();
  }, []);

  useEffect(() => {
    if (usuario) {
      obtenerEntradas(usuario.id_usuario);
      obtenerEmociones();
    }
  }, [usuario]);

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

  const obtenerEmociones = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/api/emociones`
      );
      const data = await res.json();
      setEmociones(data);
    } catch (error) {
      console.error("Error al cargar emociones:", error);
    }
  };

  const obtenerEntradas = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/api/diario/usuario/${id}`
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

  const eliminarEntrada = async (id: number) => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/diario/${id}`, {
        method: "DELETE",
      });
      alert("Entrada eliminada");
      if (usuario) obtenerEntradas(usuario.id_usuario);
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
    }
  };

  const handleGuardar = async () => {
    if (!usuario) return;
    if (!emocionSeleccionada) return alert("Selecciona una emoción.");
    if (!texto.trim()) return alert("Escribe cómo te sientes.");

    const urlBase = process.env.EXPO_PUBLIC_API_BASE;
    const payload = {
      nota: texto,
      emocion: { id_emocion: emocionSeleccionada },
    };

    try {
      if (editandoId !== null) {
        // ACTUALIZAR
        await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE}/api/diario/${editandoId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        alert("Entrada actualizada");
      } else {
        await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE}/api/diario/crear/${usuario.id_usuario}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        alert("Entrada guardada");
      }

      setTexto("");
      setEmocionSeleccionada(null);
      setEditandoId(null);
      obtenerEntradas(usuario.id_usuario);
    } catch (err) {
      console.error("Error al guardar/actualizar:", err);
    }
  };

  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#FFB800" }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{fechaActual}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>¿Qué emoción representa hoy tu día?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}
            style={{ marginBottom: 4, paddingBottom: 15 }}
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
            // placeholder="Escribe tu entrada aquí..."
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            value={texto}
            onChangeText={setTexto}
          />

          <TouchableOpacity style={styles.button} onPress={handleGuardar}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>

          <View>
            <SwipeListView
              // contentContainerStyle={{ flexGrow: 1 }}
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
                    style={[styles.botonOculto, { backgroundColor: "#ff9800" }]}
                    onPress={() => {
                      setTexto(item.nota);
                      setEmocionSeleccionada(item.emocion.id_emocion);
                      setEditandoId(item.id_registro);
                    }}
                  >
                    <Text style={styles.textoBoton}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.botonOculto, { backgroundColor: "#f44336" }]}
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

    // </SafeAreaView>
  );
};

export default DiarioEmociones;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e5f5",
  },
  header: {
    backgroundColor: "#FFB800",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",

    // marginTop: 20,
  },
  headerText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginTop: 15,
  },
  content: {
    // flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
    marginTop: 0,
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
    marginBottom: 15,
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
    borderRadius: 10,
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
    borderRadius: 10,
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
