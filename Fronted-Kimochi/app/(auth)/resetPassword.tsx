import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
export default function ResetPasswordScreen() {
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");

  const { email: emailP, token: tokenP } = useLocalSearchParams<{
    email?: string;
    token?: string;
  }>();

  useEffect(() => {
    if (emailP && tokenP) {
      setEmail(String(emailP));
      setToken(String(tokenP));
    } else {
      Alert.alert("Error", "Enlace inválido.");
      router.replace("/login");
    }
  }, [emailP, tokenP]);

  const handleReset = async () => {
    if (!password || password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/api/usuarios/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            token,
            nuevaPassword: password,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Contraseña actualizada.");
        router.replace("/login");
      } else {
        const text = await response.text();
        Alert.alert("Error", text || "Ocurrió un error.");
      }
    } catch (err) {
      Alert.alert("Error de red", "No se pudo conectar al servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nueva contraseña</Text>
        <Text style={styles.subtitle}>Introduce tu nueva contraseña</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Nueva contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Confirmar contraseña"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#555"
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Restablecer contraseña</Text>
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
  title: { fontSize: 26, fontWeight: "bold", marginTop: 20 },
  subtitle: { marginTop: 10, color: "#333" },
  form: { paddingHorizontal: 20, marginTop: 40 },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
