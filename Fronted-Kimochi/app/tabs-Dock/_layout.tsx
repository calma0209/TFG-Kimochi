// app/(tabs-with-dock)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import Dock from "@/components/dock";
import { View, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <View style={styles.dockContainer}>
        <Dock />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
});
