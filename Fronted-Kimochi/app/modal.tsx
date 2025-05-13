// app/login.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Parte superior amarilla */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Text style={styles.register}>Index</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput placeholder="Username" style={styles.input} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Login social */}
      <View style={styles.socialLogin}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="#EA4335" />
          <Text style={styles.socialText}>Continue with Google</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#1877F2" />
          <Text style={styles.socialText}>Continue with Facebook</Text>
          <Text style={styles.arrow}>→</Text>
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
  register: { position: "absolute", right: 20, top: 60, fontWeight: "bold" },
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
  forgot: { alignSelf: "flex-end", color: "#555", marginBottom: 20 },
  signInButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  signInText: { color: "#fff", fontWeight: "bold" },
  socialLogin: { marginTop: 30, paddingHorizontal: 20 },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  socialText: { flex: 1, textAlign: "center", fontWeight: "bold" },
  arrow: { fontSize: 20 },
});
