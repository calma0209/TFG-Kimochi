// app/(tabs)/dashboard.tsx
import { useIsTablet } from "@/hooks/useIsTablet";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Dock from "@/components/dock";

import consejos from "@/constants/consejos.json";
import { SafeAreaView } from "react-native-safe-area-context";
const DashboardScreen = () => {
  const router = useRouter();
  const isTablet = useIsTablet();

  type Advice = keyof typeof consejos;
  const consejo = consejos.consejos;

  const consejoAleatorio = consejo[Math.floor(Math.random() * consejo.length)];

  const mensaje = consejoAleatorio.texto;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido a Kimochi</Text>
        </View>

        <View>
          <Text style={styles.adviceText}>{mensaje}</Text>
        </View>
        <View style={{ marginTop: isTablet ? 225 : 0 }}>
          <View style={styles.cardsContainer}>
            <Card
              icon={<FontAwesome5 name="gamepad" size={40} color="#6a1b9a" />}
              title="Juegos"
              description="Responde a diferentes situaciones de la vida."
              onPress={() => router.push("/(tabs)/opcionesJuegos")}
            />
            <Card
              icon={<FontAwesome5 name="award" size={40} color="#6a1b9a" />}
              title="Recompensas"
              description="Gana insignias y recompensas por tu progreso."
              // onPress={() => router.push("/perfil")}
            />
            <Card
              icon={<FontAwesome5 name="book" size={40} color="#6a1b9a" />}
              title="Diario de Emociones"
              description="Gana insignias y Diario de Emociones por tu progreso."
              onPress={() => router.push("/(tabs)/diarioEmociones")}
            />
          </View>
          {/* <Card
          icon={<FontAwesome5 name="lightbulb" size={40} color="#6a1b9a" />}
          title="Consejos Motivacionales"
          description="Obtén un consejo para tu día."
          // onPress={() => router.push('/adviceapi')}
        /> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const Card = ({ icon, title, description, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    {icon}
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{description}</Text>
    <View style={styles.cardButton}>
      <Text style={styles.buttonText}>Ir</Text>
    </View>
  </TouchableOpacity>
);

const { width } = Dimensions.get("window");
const isTablet = width > 600;

const styles = StyleSheet.create({
  adviceText: {
    fontSize: isTablet ? 20 : 16,
    fontStyle: "italic",
    fontWeight: "500",
    color: "#4A148C",
    backgroundColor: "#F3E5F5",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    top: 50,
    // justifyContent: "center",
    // alignItems: "center",
  },
  dockContainer: {
    position: "absolute",
    bottom: 0,
    left: isTablet ? "25%" : 0,
    right: isTablet ? "25%" : 0,
    paddingBottom: 10,
    backgroundColor: "transparent",
    alignItems: "center",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    // marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#6a1b9a",
    marginTop: 10,
  },
  // weatherBox: {
  //   alignItems: "flex-end",
  //   marginBottom: 10,
  // },
  // weatherTitle: {
  //   fontWeight: "bold",
  //   fontSize: 14,
  // },
  // weatherInfo: {
  //   fontSize: 13,
  // },
  errorText: {
    color: "red",
  },
  cardsContainer: {
    flexDirection: "column",
    gap: 30,
    // alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f4f4f4",
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
});

export default DashboardScreen;
