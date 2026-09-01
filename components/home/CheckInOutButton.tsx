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
        activeOpacity={0.85}
        style={[
          styles.button,
          isCheckedIn ? styles.buttonDisabled : styles.buttonCheckIn,
        ]}
        onPress={onCheckIn}
        disabled={isCheckedIn || isLoading}
      >
        <View style={styles.buttonInner}>
          <Text
            style={[
              styles.buttonText,
              isCheckedIn ? styles.buttonTextDisabled : styles.buttonTextActive,
            ]}
          >
            {isLoading ? "Please wait..." : isCheckedIn ? "✓ Checked In" : "Check In"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Check Out Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.button,
          !isCheckedIn ? styles.buttonDisabled : styles.buttonCheckOut,
        ]}
        onPress={onCheckOut}
        disabled={!isCheckedIn || isLoading}
      >
        <View style={styles.buttonInner}>
          <Text
            style={[
              styles.buttonText,
              !isCheckedIn ? styles.buttonTextDisabled : styles.buttonTextActive,
            ]}
          >
            {isLoading ? "Please wait..." : "Check Out"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  buttonCheckIn: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonCheckOut: {
    backgroundColor: "#0F172A",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.UrbanistBold,
    letterSpacing: 0.2,
  },
  buttonTextActive: {
    color: Colors.white,
  },
  buttonTextDisabled: {
    color: "#94A3B8",
  },
});
