import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const PerfilScreen = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
  });

  const router = useRouter();

  const navigation = useNavigation();

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

  //para que no vuelva atrás al deslizar (iOS)

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, []);

  useEffect(() => {
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

  const handleCerrarSesion = async () => {
    await AsyncStorage.removeItem("user"); // 🔐 elimina la sesión
    Toast.show({
      type: "success",
      text1: "Has cerrado sesión",
      position: "bottom",
    });
    router.replace("/");
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
