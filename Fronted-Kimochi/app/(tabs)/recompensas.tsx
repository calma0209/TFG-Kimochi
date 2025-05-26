import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useIsTablet } from "@/hooks/useIsTablet";

type Recompensa = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: "insignia" | "moneda";
  imagen_url: string;
};

type RecompensaUsuario = {
  id_recompensa_usuario: number;
  cantidad_monedas: number;
  recompensa: Recompensa;
};

const RecompensasScreen: React.FC = () => {
  const [insignias, setInsignias] = useState<RecompensaUsuario[]>([]);
  const [monedas, setMonedas] = useState<number>(0);
  const isTablet = useIsTablet();
  const usuarioId = 27; // reemplaza por auth si lo necesitas

  useEffect(() => {
    fetch(
      `http://192.168.1.38:8080/api/recompensas-usuarios/usuario/${usuarioId}`
    )
      .then((res) => res.json())
      .then((data: RecompensaUsuario[]) => {
        setInsignias(data);
        const totalMonedas = data
          .filter((r) => r.recompensa.tipo === "moneda")
          .reduce((acc, cur) => acc + cur.cantidad_monedas, 0);
        setMonedas(totalMonedas);
      })
      .catch((err) => console.error("Error cargando recompensas:", err));
  }, []);

  const renderInsignia = ({ item }: { item: RecompensaUsuario }) => {
    if (item.recompensa.tipo !== "insignia") return null;

    return (
      <View style={styles.card}>
        <FontAwesome5 name="award" size={40} color="#6a1b9a" />
        <Text style={styles.cardTitle}>{item.recompensa.nombre}</Text>
        <Text style={styles.cardText}>{item.recompensa.descripcion}</Text>
        {item.recompensa.imagen_url && (
          <Image
            source={{ uri: item.recompensa.imagen_url }}
            style={styles.image}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.monedasBox}>
          <FontAwesome5 name="coins" size={24} color="#FFD700" />
          <Text style={styles.monedasTexto}>{monedas}</Text>
        </View>

        <Text style={styles.title}>Tus Insignias</Text>

        <FlatList
          data={insignias}
          renderItem={renderInsignia}
          keyExtractor={(item) => item.id_recompensa_usuario.toString()}
          contentContainerStyle={styles.cardsContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const isTablet = width > 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 40 : 20,
    backgroundColor: "#fff",
  },
  monedasBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 10,
    marginBottom: 10,
  },
  monedasTexto: {
    marginLeft: 6,
    fontSize: 20,
    fontWeight: "bold",
    color: "#6a1b9a",
  },
  title: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    color: "#6a1b9a",
    textAlign: "center",
    marginBottom: 20,
  },
  cardsContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    padding: isTablet ? 30 : 20,
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
  image: {
    width: isTablet ? 180 : 120,
    height: isTablet ? 120 : 80,
    resizeMode: "contain",
    marginTop: 10,
  },
});

export default RecompensasScreen;
