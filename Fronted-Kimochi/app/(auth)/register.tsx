import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
// import { FontAwesome } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    //limpiar el error anterior si es que lo hay
    setError("");

    if (!nombre || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // await sirve para esperar a que se complete la promesa (fetch)
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/api/usuarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_usuario: nombre,
            email: email,
            contraseña: password,
            rol: "usuario",
          }),
        }
      );
      if (response.ok) {
        setError("");
        Toast.show({
          type: "success",
          text1: "Registro exitoso",
          text2: "Tu cuenta ha sido creada! 🎉",
          position: "bottom",
        });
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      } else {
        const errorData = await response.json();
        // verificamos si el nombre o correo ya están en uso
        if (errorData.message.includes("correo")) {
          setError(
            "El correo electrónico ya está registrado. Inicia sesión para continuar."
          );
        }
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setError(
        "El usuario o el correo ya están en uso. Inicia sesión para continuar."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Registrarse</Text>
        <Text style={styles.subtitle}>
          Crea una cuenta para comenzar a usar Kimochi
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput
          placeholder="Nombre de usuario"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Confirmar contraseña"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#555"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Opción de volver al login */}
      <View style={styles.footer}>
        <Text>¿Ya tienes cuenta?</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
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
