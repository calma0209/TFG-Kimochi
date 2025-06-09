import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Envía la petición al backend para generar y mandar un informe PDF
 * @param juegos  Array con los juegos que se quieren incluir
 * @returns true si la petición fue OK
 */
export const enviarInforme = async (juegos: string[]): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem("user");
    if (!raw) return false;
    const { id_usuario } = JSON.parse(raw);

    // backend admite ?juegos=emociones,empatia
    const query = `?juegos=${juegos.join(",")}`;

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE}/api/enviar-informe/${id_usuario}${query}`,
      { method: "POST" }
    );

    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};
