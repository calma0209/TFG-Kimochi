import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PerfilScreen = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
  });

  const router = useRouter();

  useEffect(() => {
    // 🔁 Llamada a la API para obtener los datos del usuario
    const obtenerDatosUsuario = async () => {
      try {
        // const respuesta = await fetch("https://tu-backend.com/api/usuario/perfil", {
        //   method: "GET",
        //   headers: {
        //     Authorization: `Bearer TOKEN_DEL_USUARIO`, // Si usáis JWT
        //   },
        // });
        // const data = await respuesta.json();
        // setUsuario({ nombre: data.nombre, correo: data.email });

        // Simulación de respuesta:
        setUsuario({
          nombre: "Nombre del Usuario",
          correo: "usuario@kimochi.com",
        });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const handleCerrarSesion = () => {
    // 🔐 Aquí se eliminaría el token almacenado o sesión activa
    // Luego se redirige a la pantalla de login
    Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente");
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con degradado */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="white" />
        <Text style={styles.username}>{usuario.nombre}</Text>
      </View>

      {/* Info del perfil */}
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

      {/* Botón de cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleCerrarSesion}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PerfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginTop: 10,
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
});
