import { useIsTablet } from "@/hooks/useIsTablet";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

export default function LoginScreen() {
  console.log("🔧 API_BASE =", process.env.EXPO_PUBLIC_API_BASE);

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((res) => {
        console.log("usuario guardado:", res);
      })
      .catch((err) => {
        console.log("Error en AsyncStorage:", err);
      });
  }, []);
  // //para que la pantalla no gire
  const isTablet = useIsTablet();
  //

  const [email, setEmail] = useState("");
  const [contraseña, setPassword] = useState("");
  const [error, setError] = useState("");

  // función para manejar el inicio de sesión
  const handleLogin = async () => {
    setError("");

    if (!email || !contraseña) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/api/usuarios/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contraseña }),
        }
      );

      if (response.ok) {
        const usuario = await response.json();
        await AsyncStorage.setItem("user", JSON.stringify(usuario));

        Toast.show({
          type: "success",
          text1: "¡Sesión iniciada!",
          text2: `Bienvenido/a, ${usuario.nombre_usuario}!`,
          position: "bottom",
        });

        setTimeout(() => {
          router.replace("/(private)/(tabs)/dashboard");
        }, 500);
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (e) {
      console.error("Error de conexión:", e);
      setError("No se pudo conectar al servidor.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Parte superior amarilla */}
        <View style={styles.header}>
          <Text style={styles.title}>Iniciar sesión</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <View style={styles.form2}>
            <TextInput
              placeholder="Correo electrónico"
              style={styles.input}
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              placeholderTextColor="#555"
              secureTextEntry
              value={contraseña}
              onChangeText={setPassword}
            />
            {error ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}
          </View>

          <View style={{ marginTop: isTablet ? 750 : 250 }}>
            <View style={styles.rowLinks}>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.register2}>Registrarse</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
                <Text style={styles.forgot}>Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
              <Text style={styles.signInText}>Entrar</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={20} color="#EA4335" />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={20} color="#1877F2" />
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={20} color="black" />
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      {/* Login social */}
      {/* <View style={styles.socialLogin}></View> */}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  form2: {
    marginTop: 50,
  },
  form3: { marginTop: 250 },
  header: {
    backgroundColor: "#FFB800",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },

  formContainer: {
    // flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },

  form: {
    width: "100%",
  },

  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 30,
  },

  rowLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },

  register2: {
    paddingHorizontal: 5,
    color: "#555",
    fontWeight: "600",
  },

  forgot: {
    paddingHorizontal: 5,
    color: "#555",
    fontWeight: "600",
  },

  signInButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  signInText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // socialLogin: {
  //   paddingHorizontal: 70,
  //   paddingBottom: 20,
  // },

  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 20,
  },

  socialButton2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  socialText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
});
