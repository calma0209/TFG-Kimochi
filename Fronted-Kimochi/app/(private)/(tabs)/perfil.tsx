import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Modal,
  Switch,
  StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { enviarInforme } from "@/constants/enviarInforme";

const PerfilScreen = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
  });

  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [juegos, setJuegos] = useState({
    emociones: true,
    empatia: true,
    como_me_siento: true,
  });

  // const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("light-content");

      return () => {
        // Puedes resetear aquí si lo necesitas
      };
    }, [])
  );

  //para que la pantalla no vuelva atrás al presionar el botón de atrás (Android)
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // ← bloquea volver atrás
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  // //para que no vuelva atrás al deslizar (iOS)

  // useEffect(() => {
  //   navigation.setOptions({ gestureEnabled: false });
  // }, []);

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("user").then((res) =>
      console.log("usuario guardado:", res)
    );
    const obtenerDatosUsuario = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUsuario({
            nombre: user.nombre_usuario,
            correo: user.email,
          });
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    obtenerDatosUsuario();
  }, []);
  const handleEnviarInforme = async () => {
    const seleccion = Object.entries(juegos)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    if (seleccion.length === 0) {
      Toast.show({
        type: "info",
        text1: "Selecciona al menos un juego",
      });
      return;
    }

    const ok = await enviarInforme(seleccion);
    Toast.show({
      type: ok ? "success" : "error",
      text1: ok ? "Informe enviado al correo" : "No se pudo enviar el informe",
      position: "bottom",
    });
    setModalVisible(false);
  };

  // Función para manejar el cierre de sesión
  const handleCerrarSesion = async () => {
    await AsyncStorage.removeItem("user"); // elimina la sesión activa
    Toast.show({
      type: "success",
      text1: "Has cerrado sesión",
      position: "bottom",
    });
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#f3e5f5" /> */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={90} color="white" />
        <Text style={styles.username}>{usuario.nombre}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="#6a1b9a" />
          <Text style={styles.infoText}>{usuario.nombre}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="mail" size={24} color="#6a1b9a" />
          <Text style={styles.infoText}>{usuario.correo}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleCerrarSesion}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: "#FFB800", marginTop: 20 },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.logoutText}>Enviar informe</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Selecciona juegos</Text>

            {(["emociones", "empatia"] as const).map((k) => (
              <View style={styles.switchRow} key={k}>
                <Text style={styles.switchLabel}>{k.replaceAll("_", " ")}</Text>
                <Switch
                  value={juegos[k]}
                  onValueChange={(v) => setJuegos({ ...juegos, [k]: v })}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: "#6a1b9a" }]}
              onPress={handleEnviarInforme}
            >
              <Text style={styles.logoutText}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#666", marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PerfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e5f5",
  },
  header: {
    backgroundColor: "#6a1b9a",
    alignItems: "center",
    paddingVertical: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  username: {
    fontSize: 22,
    color: "#fff",
    marginTop: 20,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 50,
    backgroundColor: "#6a1b9a",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  /* Modal */
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
    marginVertical: 8,
  },
  switchLabel: { fontSize: 16, textTransform: "capitalize" },
});
