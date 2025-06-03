import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: false, // 👈 aquí
        headerShown: false,
      }}
    />
  );
}
