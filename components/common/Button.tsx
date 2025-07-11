import { ActivityIndicator, Pressable, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

export default function Button({
  onPress,
  title,
  button_style={},
  isIndicator = false,
}: any) {
  return (
    <Pressable android_ripple={{color: Colors.light}} style={[styles.btn, button_style.btn]} onPress={onPress}>
      <View style={styles.btnTextIndicator}>
        <Text style={[styles.btnText, button_style.title]}>{title}</Text>
        {isIndicator && (
          <ActivityIndicator
            size="small"
            color={button_style.indicatorColor || Colors.text.secondary}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.button.tertiary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.secondary,
  },
  btnTextIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
