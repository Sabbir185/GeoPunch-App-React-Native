import Toast from "react-native-toast-message";

export const showToast = (type: "success" | "error", message: string) => {
  Toast.show({
    type,
    text1: message,
  });
};
