import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 600;

export default function EnProcesoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚧 En proceso...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: isTablet ? 28 : 20,
    color: "#6a1b9a",
    fontWeight: "bold",
    textAlign: "center",
  },
});
