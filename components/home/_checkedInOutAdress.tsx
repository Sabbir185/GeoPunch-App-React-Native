import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fonts } from "@/constants/Fonts";
import { images } from "@/constants/images";
import { Colors } from "@/constants/Colors";

interface Props {
  title?: string;
  color?: string;
  address?: string;
  time?: string;
}

export default function CheckedInOutAdress({
  title,
  color,
  address,
  time,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: color }]}>{title}</Text>
      {/* address */}
      <View style={styles.logoContainer}>
        <Image source={images.location} style={styles.logo} />
        <Text style={styles.location}>
          {address
            ? address?.length <= 40
              ? address
              : address?.slice(0, 40) + ".."
            : "N/A"}
        </Text>
      </View>
      {/* timer */}
      <View style={styles.logoContainer}>
        <Image source={images.timer} style={styles.logo} />
        <Text style={styles.timer}>{time}</Text>
      </View>
    </View>
  );
}

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: deviceWidth < 380 ? 0 : 3,
    width: "100%",
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.SatoshiMedium,
    fontWeight: 700,
  },
  logoContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 5,
  },
  logo: {
    width: 16,
    height: 16,
    tintColor: Colors.text.secondary,
  },
  location: {
    color: Colors.text.secondary,
    fontSize: 12,
    fontFamily: Fonts.SatoshiMedium,
    width: deviceWidth < 380 ? 150 : 190,
  },
  timer: {
    color: Colors.text.primary,
    fontSize: 14,
    fontFamily: Fonts.SatoshiMedium,
    fontWeight: 700,
  },
});
