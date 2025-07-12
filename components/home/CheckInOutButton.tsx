import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import { submitCheckIn, submitCheckOut } from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";

interface CheckInOutButtonProps {
  isCheckedIn: boolean;
  fetchUserProfile: () => void;
  isLoading?: boolean;
  user?: any;
  location?: {
    lat: number | null;
    lng: number | null;
    address: string | null;
  };
  setCheckInIndicator: (value: boolean) => void;
  setCheckOutIndicator: (value: boolean) => void;
}

export default function CheckInOutButton({
  isCheckedIn,
  fetchUserProfile,
  isLoading = false,
  user,
  location,
  setCheckInIndicator,
  setCheckOutIndicator,
}: CheckInOutButtonProps) {
  const onCheckIn = async () => {
    setCheckInIndicator(true);
    if (!user || !location?.lat) {
      showToast(
        "error",
        "Location data is missing. Please enable location services."
      );
      setCheckInIndicator(false);
      return;
    }
    try {
      const payload = {
        userId: user.id,
        checkedInTime: new Date().toISOString(),
        checkedInPlace: {
          address: location?.address,
          position: {
            lat: location?.lat,
            lng: location?.lng,
          },
        },
      };
      const res = await submitCheckIn(payload);
      if (res?.status === 200) {
        showToast("success", res?.msg || "Checked-in successful");
        await fetchUserProfile();
      } else {
        showToast("error", res?.msg || "Checked-in failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Failed. Please try again.");
    } finally {
      setCheckInIndicator(false);
    }
  };

  const onCheckOut = async () => {
    setCheckOutIndicator(true);
    if (!user || !location?.lat) {
      showToast(
        "error",
        "Location data is missing. Please enable location services."
      );
      setCheckOutIndicator(false);
      return;
    }
    try {
      const payload = {
        id: user?.activityLog?.id,
        userId: user.id,
        checkedOutTime: new Date().toISOString(),
        checkedOutPlace: {
          address: location?.address,
          position: {
            lat: location?.lat,
            lng: location?.lng,
          },
        },
      };
      const res = await submitCheckOut(payload);
      if (res?.status === 200) {
        showToast("success", res?.msg || "Checked-out successful");
        await fetchUserProfile();
      } else {
        showToast("error", res?.msg || "Checked-in failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Failed. Please try again.");
    } finally {
      setCheckOutIndicator(false);
    }
  };

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
