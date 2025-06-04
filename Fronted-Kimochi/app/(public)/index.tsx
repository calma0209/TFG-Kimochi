import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

export default function WelcomeScreen() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);
  return (
    <View style={styles.container}>
      {/* Logo y nombre de la app */}
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/images/focaInicio.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Kimochi</Text>
        <Text style={styles.slogan}>Bienestar Emocional</Text>
      </View>

      {/* Sección inferior con fondo amarillo */}
      <View style={styles.bottomSection}>
        <Text style={styles.welcomeTitle}>Bienvenido</Text>
        <Text style={styles.welcomeText}>
          Mejora la inteligencia emocional de forma divertidai.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.signInText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.signUpText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  topSection: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  slogan: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#FFB800",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  welcomeText: {
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "column", // De 'row' a 'column'
    gap: 12,
    width: "100%", // Para que se alineen bien
    alignItems: "center", // Centra los botones
  },
  signInButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  signInText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  signUpText: {
    color: "#000",
    fontWeight: "bold",
  },
});
