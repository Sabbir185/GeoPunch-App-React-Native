import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Fonts } from "@/constants/Fonts";
import UserProfile from "@/components/home/Profile";
import { images } from "@/constants/images";
import { Colors } from "@/constants/Colors";
import OptionCard from "@/components/more/OptionCard";
import Button from "@/components/common/Button";
import { UserContext } from "@/contexts/user";

export default function More() {
  const { logout, user } = useContext(UserContext);

  return (
    <ScrollView
      style={{ flex: 1, maxHeight: "100%", backgroundColor: "#F8FAFC" }}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>More</Text>
          {/* profile information */}
          <View style={styles.profileContainer}>
            <UserProfile
              name={user?.name || "--"}
              image={user?.image}
              email={user?.email || "--"}
              nameTitleSize={20}
              imgSize={64}
            />
          </View>

          {/* Options */}
          <View>
            <Text style={styles.optionsText}>Options</Text>
            <View style={styles.optionsContainer}>
              <OptionCard
                title="Personal Information"
                icon={images.avatarIcon}
                screenUrl="/profile"
              />
              <OptionCard
                title="Setting"
                icon={images.settingIcon}
                screenUrl="/settings"
              />
            </View>
          </View>
        </View>

        {/* logout */}
        <View style={styles.logoutContainer}>
          <Button
            onPress={() => {
              logout();
            }}
            title="Log Out"
            button_style={{
              btn: {
                backgroundColor: Colors.primary,
                marginTop: 30,
                width: 200,
                height: 50,
                borderRadius: 14,
              },
              title: {
                color: Colors.white,
                fontFamily: Fonts.SatoshiMedium,
                fontSize: 18,
              },
              indicatorColor: Colors.white,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 64,
    backgroundColor: "#F8FAFC",
    minHeight: "100%",
  },
  title: {
    fontFamily: Fonts.UrbanistBold,
    fontSize: 22,
    color: "#0F172A",
    textAlign: "center",
  },
  profileContainer: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  optionsText: {
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    color: Colors.text.secondary,
  },
  optionsContainer: {
    flexDirection: "column",
    gap: 14,
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 25,
  },
});
