import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Image } from "react-native";

export default function CheckedInOutButton({
  onPress,
  title,
  button_style = {},
  isIndicator = false,
  image,
  tintColor,
}: any) {
  return (
    <View style={[styles.container, button_style.btn]}>
      <Pressable
        android_ripple={{ color: Colors.light }}
        style={styles.pressable}
        onPress={onPress}
      >
        <View style={styles.btnTextIndicator}>
          {image && (
            <Image
              source={image}
              style={{ width: 20, height: 18, overflow: "hidden" }}
              tintColor={tintColor}
            />
          )}
          <Text style={[styles.btnText, button_style.title]}>{title}</Text>
          {isIndicator && (
            <ActivityIndicator
              size="small"
              color={button_style.indicatorColor || Colors.text.secondary}
            />
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.button.tertiary,
    borderRadius: 20,
    overflow: "hidden",
    width: 200,
    height: 56,
    position: "absolute",
    bottom: -45,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "500",
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
