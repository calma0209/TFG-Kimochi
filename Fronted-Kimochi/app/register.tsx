import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
// import { FontAwesome } from "@expo/vector-icons";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>
          Crea una cuenta para comenzar a usar Kimochi
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput
          placeholder="Nombre completo"
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Confirmar contraseña"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#555"
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.replace("/tabs-Dock/dashboard")}
        >
          <Text style={styles.registerText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Opción de volver al login */}
      <View style={styles.footer}>
        <Text>¿Ya tienes cuenta?</Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.loginLink}> Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#FFB800",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backArrow: { fontSize: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 20 },
  subtitle: { marginTop: 10, color: "#333" },
  form: { paddingHorizontal: 20, marginTop: 30 },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  registerText: { color: "#fff", fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
