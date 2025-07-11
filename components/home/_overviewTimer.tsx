import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

type Props = {
  title: string;
  hrs: string;
  isHrs?: boolean;
};

export default function OverviewTimer({ title, hrs, isHrs = false }: Props) {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: Fonts.SatoshiMedium,
          fontWeight: 500,
          fontSize: 14,
          color: Colors.text.primary,
          width: 70
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.SatoshiMedium,
          fontWeight: 500,
          fontSize: 14,
          color: Colors.text.primary,
          textAlign: "left",
          width: "100%"
        }}
      >
        <Text style={{ fontWeight: 700 }}>{hrs || "00"}</Text>{" "}
        {isHrs ? "H" : "Days"}
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
