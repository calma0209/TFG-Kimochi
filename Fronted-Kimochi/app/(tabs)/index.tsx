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
          source={require("../../assets/images/ositoInicio.png")} // Coloca tu logo aquí
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Kimochi</Text>
        <Text style={styles.slogan}>Emotional Wellness</Text>
      </View>

      {/* Sección inferior con fondo amarillo */}
      <View style={styles.bottomSection}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeText}>
          Mejora la inteligencia emocional de forma divertida y adaptada a ti.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
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
    paddingTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  slogan: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#FFB800",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  welcomeText: {
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  signInButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginRight: 10,
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
  },
  signUpText: {
    color: "#000",
    fontWeight: "bold",
  },
});
