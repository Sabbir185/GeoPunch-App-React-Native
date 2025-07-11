import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import Button from "@/components/common/Button";
import SelectInput from "@/components/common/Select";
import DateTimePickerInput from "@/components/common/DateTimePicker";
import ImagePickerInput from "@/components/common/ImagePicker";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateProfile } from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "@/contexts/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/config";

const genderData = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export default function UserProfile() {
  const router = useRouter();
  const [gender, setGender] = React.useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<any>();
  const [dateTime, setDateTime] = useState();
  const [isIndicator, setIsIndicator] = useState(false);
  const { fetchUserProfile } = useContext(UserContext);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onSubmit = async () => {
    if (!image || !gender || !dateTime) {
      return showToast("error", "Please fill all the fields");
    }
    try {
      setIsIndicator(true);
      const payload = {
        image: typeof image === "string" ? image : image?.assets[0]?.uri,
        gender: gender,
        dateOfBirth: dayjs(dateTime).format("YYYY-MM-DD"),
      };
      const res = await updateProfile(payload);
      if (res?.statusCode === 400) {
        showToast("error", res?.message);
      } else if (res?.statusCode === 401) {
        showToast("error", res?.message);
      } else {
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.message ||
            "OTP verification failed, Please try again."
        );
      } else {
        showToast("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsIndicator(false);
    }
  };

  const getStarted = async () => {
    await fetchUserProfile();
    toggleModal();
    router.push("/");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.screen}>
        <KeyboardAvoidingView style={styles.screen}>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Don't worry, only you can see your personal data.
              </Text>
              <Text>No one else will have access to it.</Text>
            </View>

            {/* profile image */}
            <ImagePickerInput
              imageValue={image}
              setImageValue={async (data) => {
                const formData: any = new FormData();
                formData.append("image", {
                  uri: data?.assets[0]?.uri,
                  type: data?.assets[0]?.mimeType,
                  name: data?.assets[0]?.fileName,
                });
                try {
                  const token = await AsyncStorage.getItem("token");
                  const response: any = await axios.post(
                    config.API_URL + "/profile/image",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (response?.data?.imageUrl) {
                    const pic =
                      response?.data?.imageUrl || data?.assets[0]?.uri;
                    setImage(pic);
                  } else {
                    showToast("error", response?.message);
                  }
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    showToast(
                      "error",
                      error.response?.data?.message ||
                        "Failed to upload, Please try again."
                    );
                  } else {
                    showToast(
                      "error",
                      "An unexpected error occurred. Please try again."
                    );
                  }
                }
              }}
            />

            {/* form data */}
            <View>
              <Text style={styles.label}>Date of Birth</Text>
              <DateTimePickerInput
                dateTime={dateTime}
                setDateTime={setDateTime}
              />
            </View>
            <View>
              <Text style={styles.label}>Gender</Text>
              <SelectInput
                value={gender}
                setValue={setGender}
                data={genderData}
              />
            </View>

            {/* Complete Button */}
            <Button
              onPress={onSubmit}
              title="Complete Profile"
              button_style={{
                btn: {
                  backgroundColor: Colors.primary,
                  marginTop: 30,
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

            {/* modal */}
            <Modal isVisible={isModalVisible} animationIn={"bounceInUp"}>
              <View
                style={{
                  width: "100%",
                  height: 400,
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                  elevation: 5,
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/welcome_elements.png")}
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: "contain",
                    marginBottom: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: Fonts.UrbanistSemibold,
                    color: Colors.text.primary,
                    fontSize: 24,
                    fontWeight: "600",
                  }}
                >
                  Welcome to GPS Tracking
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.SatoshiMedium,
                    color: Colors.text.secondary,
                    fontSize: 16,
                    fontWeight: 400,
                    marginTop: 5,
                    textAlign: "center",
                  }}
                >
                  Account setup complete. Enjoy seamless GPS attendance
                  tracking!
                </Text>
                <Button
                  title="Get Started"
                  onPress={getStarted}
                  button_style={{
                    btn: {
                      backgroundColor: Colors.primary,
                      marginTop: 20,
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
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  textContainer: {
    marginTop: deviceHeight < 750 ? 45 : 70,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: 600,
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 24,
    color: Colors.text.primary,
  },
  subtitle: {
    fontWeight: 400,
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 14,
    color: Colors.text.secondary,
    marginVertical: 7,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  label: {
    color: Colors.text.primary,
    fontFamily: Fonts.Satoshi,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
});
