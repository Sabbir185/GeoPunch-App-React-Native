import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { images } from "@/constants/images";
import CheckedInOutButton from "@/components/common/checkedInOut";
import Modal from "react-native-modal";
import { Image } from "react-native";
import Button from "@/components/common/Button";
import { accountDeleteByToken } from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeleteAccount() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isIndicator, setIsIndicator] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {/* header part */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              router.push("/settings");
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
          <Text style={styles.headerText}>Delete Account</Text>
        </View>
      </View>
      {/* content part */}
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.title}>Delete Account</Text>
          <Text style={styles.subTitle}>
            Are you sure you want to delete your account? Please read how
            account deletion will affect.
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subTitle}>
            Deleting your account removes personal information our database.
            Your email becomes permanently reserved and same email cannot be
            re-use to register a new account.
          </Text>
        </View>
      </View>
      {/* submit button */}
      <View style={styles.inputSubmitBtn}>
        <CheckedInOutButton
          onPress={() => setModalVisible(true)}
          title={"Delete"}
          button_style={{
            btn: {
              backgroundColor: Colors.error,
              width: "100%",
              borderRadius: 10,
              height: 56,
            },
            title: {
              color: Colors.white,
              fontFamily: Fonts.SatoshiMedium,
              fontSize: 18,
            },
            indicatorColor: Colors.white,
          }}
          image={images.deleteIcon}
          tintColor={Colors.white}
        />
      </View>

      {/* modal */}
      <Modal isVisible={isModalVisible} animationIn={"bounceInUp"}>
        <View
          style={{
            width: "100%",
            height: 350,
            backgroundColor: Colors.white,
            borderRadius: 20,
            elevation: 5,
            padding: 20,
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#FEF4EE",
              padding: 10,
              borderRadius: 100,
            }}
          >
            <Image
              source={images.deleteIcon}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
              }}
            />
          </View>
          {/* message */}
          <View>
            <Text
              style={{
                fontFamily: Fonts.UrbanistSemibold,
                color: Colors.text.primary,
                fontSize: 24,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Delete Account
            </Text>
            <Text
              style={{
                fontFamily: Fonts.SatoshiMedium,
                color: Colors.text.secondary,
                fontSize: 16,
                fontWeight: 400,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Are you sure you want to Delete Account?
            </Text>
          </View>
          {/* buttons */}
          <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              button_style={{
                btn: {
                  backgroundColor: "#EDEEF1",
                  flex: 1,
                },
                title: {
                  color: Colors.primary,
                  fontFamily: Fonts.SatoshiMedium,
                  fontSize: 18,
                },
                indicatorColor: Colors.white,
              }}
            />
            <Button
              title="Delete"
              onPress={async () => {
                try {
                  setIsIndicator(true);
                  const res = await accountDeleteByToken({isDeleted: true});
                  if (res?.status === 401) {
                    showToast("error", res?.msg);
                  } else {
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("user");
                    setModalVisible(false);
                    router.push("/login");
                  }
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    showToast(
                      "error",
                      error?.message ||
                        "Failed to delete, Please try again."
                    );
                  } else {
                    showToast(
                      "error",
                      "An unexpected error occurred. Please try again."
                    );
                  }
                } finally {
                  setIsIndicator(false);
                }
              }}
              button_style={{
                btn: {
                  backgroundColor: Colors.error,
                  flex: 1,
                  color: Colors.tertiary,
                },
                title: {
                  color: Colors.white,
                  fontFamily: Fonts.SatoshiMedium,
                  fontSize: 18,
                },
                indicatorColor: Colors.white,
              }}
              isIndicator={isIndicator}
            />
          </View>
        </View>
      </Modal>
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
  inputSubmitBtn: {
    marginTop: 30,
  },
  infoContainer: {
    marginVertical: 30,
    flexDirection: "column",
    gap: 20,
  },
  title: {
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  subTitle: {
    marginTop: 10,
    fontFamily: Fonts.Satoshi,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.text.secondary,
  },
});
