import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";
import { Fonts } from "@/constants/Fonts";
import { images } from "@/constants/images";

interface IProps {
  date?: string;
  location?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function ActivityCard({
  date,
  location,
  checkIn,
  checkOut,
}: IProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {date}
      </Text>
      <View style={styles.logoContainer}>
        <Image source={images.locationPin} style={styles.logo} />
        <Text style={styles.location}>{location}</Text>
      </View>
      <View style={styles.InOutContainer}>
        <View style={styles.InOut}>
          <View style={styles.InOutLogoContainer}>
            <Image source={images.inIcon} style={styles.InOutLogo} />
          </View>
          <Text style={styles.InOutTimer}>{checkIn}</Text>
        </View>
        <View style={styles.InOut}>
          <View style={styles.InOutLogoContainer}>
            <Image source={images.outIcon} style={styles.InOutLogo} />
          </View>
          <Text style={styles.InOutTimer}>{checkOut}</Text>
        </View>
      </View>
    </View>
  );
}

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 20,
    borderLeftColor: Colors.tertiary,
    flexDirection: "column",
    justifyContent: "space-evenly",
    gap: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    fontFamily: Fonts.SatoshiMedium,
  },
  logoContainer: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
  },
  logo: {
    width: 20,
    height: 20,
  },
  location: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: Fonts.SatoshiMedium,
    width: deviceWidth < 380 ? 250 : 300,
  },
  InOutContainer: {
    flexDirection: "row",
    gap: 30,
    marginTop: 5,
  },
  InOut: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  InOutLogoContainer: {
    width: 32,
    height: 32,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#EAF3FF",
  },
  InOutLogo: {
    width: 20,
    height: 20,
  },
  InOutTimer: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Fonts.SatoshiMedium,
  },
});
