import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Animated,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import emocionesJSON from "@/assets/data/emociones.json";
import emocionesMap from "@/constants/emocionesMap";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width / 2.3;
type Emocion = {
  nombre: string;
  imagen: string;
  descripcion: string;
};

const TarjetaEmocion = ({ emocion }: { emocion: Emocion }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlipped = useRef(false);

  const flipCard = () => {
    const toValue = isFlipped.current ? 0 : 180;
    Animated.spring(flipAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start(() => {
      isFlipped.current = !isFlipped.current;
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ rotateY: backInterpolate }],
    top: 0,
    position: "absolute" as "absolute",
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, styles.cardFront, frontAnimatedStyle]}
        >
          <Image
            source={emocionesMap[emocion.imagen]}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>{emocion.nombre}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <Text style={styles.titleBack}>{emocion.nombre}</Text>
          <Text style={styles.description}>{emocion.descripcion}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function BiblioEmociones() {
  const emociones: Emocion[] = emocionesJSON.emociones;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.introText}>
        Pulsa una emoción para ver su descripción
      </Text>
      <FlatList
        data={emociones}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <TarjetaEmocion emocion={item} />}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}
const isTablet = width > 600;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e5f5",
  },
  introText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#6a1b9a",
    marginVertical: 12,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  cardContainer: {
    width: isTablet ? 480 : CARD_WIDTH,
    height: 220,
    margin: 10,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    backfaceVisibility: "hidden",
    padding: 12,
  },
  cardFront: {
    backgroundColor: "#ffffff",
  },
  cardBack: {
    backgroundColor: "#FFB800",
    position: "absolute",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6a1b9a",
    textAlign: "center",
  },
  titleBack: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6a1b9a",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    // fontWeight: "bold",
    color: "#6a1b9a",
    textAlign: "center",
  },
});
