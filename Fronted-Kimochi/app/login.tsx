import { useIsTablet } from "@/hooks/useIsTablet";
import React from "react";
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

import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

export default function LoginScreen() {
  const isTablet = useIsTablet();
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Parte superior amarilla */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <View style={styles.form2}>
            <TextInput
              placeholder="Username"
              style={styles.input}
              placeholderTextColor="#555"
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              placeholderTextColor="#555"
              secureTextEntry
            />
          </View>

          <View style={{ marginTop: isTablet ? 750 : 250 }}>
            <View style={styles.rowLinks}>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.register2}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push("/tabs-Dock/dashboard")}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={20} color="#EA4335" />
              {/* <Text style={styles.socialText}>Continue with Google</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={20} color="#1877F2" />
              {/* <Text style={styles.socialText}>Continue with Facebook</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={20} color="black" />
              {/* <Text style={styles.socialText}>Continue with Facebook</Text> */}
            </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#fff" },

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
