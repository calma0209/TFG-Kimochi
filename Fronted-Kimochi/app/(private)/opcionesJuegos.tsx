import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OpcionesJuegos() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Juegos</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card
            imagen={require("../../assets/images/emociones/curiosidad.png")}
            title="Biblioteca de Emociones"
            description="Las emociones y sus significados"
            onPress={() =>
              router.push("/(private)/opcionesJuegos/biblioEmociones")
            }
          />
          <Card
            imagen={require("../../assets/images/emociones/calma.png")}
            title="Juego Emociones"
            description="Juego para identificar las emociones"
            onPress={() => router.push("/(private)/opcionesJuegos/emociones")}
          />
          <Card
            imagen={require("../../assets/images/casos/caso2.png")}
            title="¿Cómo me siento si...?"
            description="Piensa en cómo te sentirías en distintas situaciones"
            onPress={() =>
              router.push("/(private)/opcionesJuegos/comoMeSiento")
            }
          />
          <Card
            imagen={require("../../assets/images/casos/caso2.png")}
            title="Juego Empatía"
            description="Juego para mejorar tu empatía con el entorno"
            onPress={() => router.push("/(private)/opcionesJuegos/empatia")}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const Card = ({ imagen, title, description, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={imagen} style={{ width: 100, height: 100 }} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{description}</Text>
  </TouchableOpacity>
);

const { width } = Dimensions.get("window");
const isTablet = width > 600;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#6a1b9a",
    marginTop: 10,
  },
  contenedor: {
    flex: 1,
    paddingTop: isTablet ? 50 : 0,
  },
  card: {
    backgroundColor: "#f4f4f4",
    marginHorizontal: isTablet ? 40 : 20,
    padding: isTablet ? 40 : 4,
    // margin: isTablet ? 20 : 10,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: isTablet ? 24 : 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  cardText: {
    fontSize: isTablet ? 18 : 14,
    textAlign: "center",
    marginVertical: 10,
  },
  cardButton: {
    backgroundColor: "#6a1b9a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContent: {
    paddingVertical: 35,
    gap: 40,
    paddingBottom: 100,
  },
});
