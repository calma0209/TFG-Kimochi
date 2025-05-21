import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DiarioEmociones = () => {
  const [texto, setTexto] = useState("");
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleGuardar = async () => {
    // Aquí irá la lógica para enviar el contenido al backend en Spring Boot
    // Ejemplo:
    /*
    await fetch("https://tu-backend.com/api/diario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        contenido: texto,
        usuarioId: 123 // Si trabajáis con autenticación
      }),
    });
    */
    alert("Entrada de diario guardada (simulación)");
    setTexto(""); // Limpia el campo después de guardar
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header con la fecha */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{fechaActual}</Text>
          </View>

          {/* Caja de texto */}
          <View style={styles.content}>
            <Text style={styles.label}>¿Cómo te sientes hoy?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escribe tu entrada aquí..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              value={texto}
              onChangeText={setTexto}
            />
            <TouchableOpacity style={styles.button} onPress={handleGuardar}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default DiarioEmociones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#FFB800",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  headerText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  textArea: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f4f4f4",
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6a1b9a",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
