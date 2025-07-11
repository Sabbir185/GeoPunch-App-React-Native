import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";

interface IProps {
  icon?: any;
  title?: string;
  screenUrl?: any;
}

export default function OptionCard({ icon, title, screenUrl }: IProps) {
  const router = useRouter();

  return (
    <View style={{ borderRadius: 10, overflow: "hidden" }}>
      <Pressable
        android_ripple={{ color: Colors.light, borderless: false }}
        style={({ pressed }: { pressed: boolean }) => [
          styles.pressableContainer,
          pressed && styles.pressedState,
        ]}
        onPress={() => {
          if (screenUrl) {
            router.push(screenUrl);
          }
        }}
      >
        <View style={styles.container}>
          <View style={styles.iconTitleContainer}>
            <Image source={icon} style={styles.icon} />
            <Text style={{ fontSize: 16 }}>{title}</Text>
          </View>
          <Image source={images.rightArrow} style={styles.arrow} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.boarder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  arrow: {
    width: 10,
    height: 30,
  },
  pressedState: {
    opacity: 0.6,
  },
});
