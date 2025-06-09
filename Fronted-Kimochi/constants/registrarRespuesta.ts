import AsyncStorage from "@react-native-async-storage/async-storage";

type Juego = "emociones" | "empatia" | "como_me_siento";

/**
 * Envía una respuesta al backend.
 * @param juego            Nombre del juego
 * @param correcta         true si la respuesta es correcta
 * @param idPregunta       ID de la pregunta (opcional)
 * @param marcada          Texto marcado (opcional)
 */
export const registrarRespuesta = async (
  juego: Juego,
  correcta: boolean,
  idPregunta?: number,
  marcada?: string
) => {
  try {
    const raw = await AsyncStorage.getItem("user");
    if (!raw) return;
    const { id_usuario } = JSON.parse(raw);

    await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/respuestas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: { id_usuario },
        juego,
        idPregunta,
        correcta,
        marcada,
      }),
    });
  } catch (err) {
    console.warn("Error registrando respuesta:", err);
  }
};
