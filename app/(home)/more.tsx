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
    <ScrollView style={{ flex: 1, maxHeight: "100%" }}>
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
              imgSize={70}
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
    flex: 1,
    paddingTop: 80,
    padding: 20,
    backgroundColor: "#F4F9FF",
    minHeight: "100%",
  },
  title: {
    fontFamily: Fonts.UrbanistBold,
    fontSize: 20,
    textAlign: "center",
  },
  profileContainer: {
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    height: 115,
    borderWidth: 1,
    borderColor: Colors.boarder,
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
