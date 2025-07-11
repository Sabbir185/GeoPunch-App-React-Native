import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";

interface CheckInOutButtonProps {
  isCheckedIn: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  isLoading?: boolean;
}

export default function CheckInOutButton({
  isCheckedIn,
  onCheckIn,
  onCheckOut,
  isLoading = false,
}: CheckInOutButtonProps) {
  return (
    <View style={styles.container}>
      {/* Check In Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isCheckedIn
              ? Colors.button.disbale
              : Colors.primary,
            opacity: isCheckedIn ? 0.6 : 1,
          },
        ]}
        onPress={onCheckIn}
        disabled={isCheckedIn || isLoading}
      >
        <Text
          style={[
            styles.buttonText,
            { color: isCheckedIn ? Colors.text.tertiary : Colors.white },
          ]}
        >
          {isLoading ? "Loading..." : "Check In"}
        </Text>
      </TouchableOpacity>

      {/* Check Out Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: !isCheckedIn
              ? Colors.button.disbale
              : Colors.secondary,
            opacity: !isCheckedIn ? 0.6 : 1,
          },
        ]}
        onPress={onCheckOut}
        disabled={!isCheckedIn || isLoading}
      >
        <Text
          style={[
            styles.buttonText,
            { color: !isCheckedIn ? Colors.text.tertiary : Colors.white },
          ]}
        >
          {isLoading ? "Loading..." : "Check Out"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    fontWeight: "600",
  },
});
