import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const DOCK_ITEM_SIZE = 50;
const MAGNIFICATION = 1.8;
const SENSITIVITY = 50;

const icons = [
  { icon: "home", action: () => router.push("/(private)/(tabs)/dashboard") },

  { icon: "user", action: () => router.push("/(private)/(tabs)/perfil") },
  // { icon: "cog", action: () => alert("Settings") },
];

export default function Dock() {
  const panX = useRef(new Animated.Value(-999)).current;
  const [dockWidth, setDockWidth] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        panX.setValue(gestureState.moveX);
      },
      onPanResponderRelease: () => panX.setValue(-999),
      onPanResponderTerminate: () => panX.setValue(-999),
    })
  ).current;

  return (
    <View
      style={styles.container}
      onLayout={(e) => setDockWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      {icons.map((item, index) => {
        const spacing = dockWidth / icons.length;
        const itemCenter = spacing * index + spacing / 2;

        const distance = Animated.subtract(panX, itemCenter);

        const scale = distance.interpolate({
          inputRange: [-SENSITIVITY, 0, SENSITIVITY],
          outputRange: [1, MAGNIFICATION, 1],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[styles.itemWrapper, { transform: [{ scale }] }]}
          >
            <TouchableOpacity
              onPress={item.action}
              activeOpacity={0.7}
              style={styles.touchArea}
            >
              <FontAwesome name={item.icon as any} size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#8a6ecb",
    paddingVertical: 12, // Antes estaba en 8

    paddingBottom: 20,
  },
  itemWrapper: {
    flex: 1, // ⚠️ distribución proporcional automática
    alignItems: "center",
    justifyContent: "center",
  },
  touchArea: {
    width: DOCK_ITEM_SIZE,
    height: DOCK_ITEM_SIZE,
    // backgroundColor: "#ada6a6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
