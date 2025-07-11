import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { images } from "@/constants/images";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

type Props = {
  imgSrc: any;
  time: string|any;
  title: string;
};

export default function OverviewDuration({ imgSrc, time, title }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={imgSrc}
        style={{ width: 20, height: 20, tintColor: Colors.primary }}
      />
      <Text
        style={{
          fontFamily: Fonts.SatoshiMedium,
          fontWeight: "700",
          fontSize: 14,
          color: time ? Colors.text.primary :  Colors.text.tertiary,
        }}
      >
        {time ? time : "_ _ : _ _"}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.UrbanistSemibold,
          fontWeight: "500",
          fontSize: 14,
          color: Colors.text.tertiary,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    borderRightWidth: 2,
    borderRightColor: Colors.background,
  },
});
