// hooks/useIsTablet.ts
import { useWindowDimensions } from "react-native";

export function useIsTablet() {
  const { width, height } = useWindowDimensions();
  const shortestSide = Math.min(width, height);
  return shortestSide >= 600;
}
