import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import OptionCard from "@/components/more/OptionCard";
import { images } from "@/constants/images";

export default function Settings() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* header part */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              router.push("/(home)/more");
            }}
            style={{ zIndex: 1 }}
          >
            <Icon
              name="arrow-left-thin"
              color={Colors.text.secondary}
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%" }}>
          <Text style={styles.headerText}>Settings</Text>
        </View>
      </View>
      {/* body part */}
      <View style={styles.optionsContainer}>
        <OptionCard
          title="Change Password"
          icon={images.ChangePassword}
          screenUrl="/settings/change_password"
        />
        <OptionCard
          title="Delete Account"
          icon={images.deleteIcon}
          screenUrl="/settings/delete_account"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FF",
    padding: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerText: {
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "column",
    gap: 14,
    marginTop: 50,
  },
});
