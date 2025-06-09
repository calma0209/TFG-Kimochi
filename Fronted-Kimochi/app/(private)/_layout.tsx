import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Dock from "@/components/dock";
import { View } from "@/components/Themed";
import { Stack } from "expo-router";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function PrivateLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        {/*dashboard, perfil, etc. */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false, // bloquea swipe back desde tabs
          }}
        />

        {/* Pantallas donde SÍ se puede volver atrás */}
        <Stack.Screen
          name="diarioEmociones"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="opcionesJuegos"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="opcionesJuegos/biblioEmociones"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="opcionesJuegos/emociones"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="opcionesJuegos/comoMeSiento"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="opcionesJuegos/empatia"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="recompensas"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        {/* <Stack.Screen
          name="(private)/perfil"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="(private)dashboard"
          options={{ headerShown: false, gestureEnabled: true }}
        /> */}
      </Stack>
      {/* <Tabs.Screen
          name="index"
          options={{
            title: "Tab One",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        /> */}
      {/* <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      /> */}
      {/* </Tabs> */}
    </View>
  );
}
