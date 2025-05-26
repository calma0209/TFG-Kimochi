// toastConfig.tsx
import React from "react";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#6a1b9a", //morado
        backgroundColor: "#f3e5f5", //morado claro
        borderRadius: 10,
        height: 80,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#4a148c", //morado
      }}
      text2Style={{
        fontSize: 14,
        color: "#4a148c", //morado
      }}
    />
  ),
};
