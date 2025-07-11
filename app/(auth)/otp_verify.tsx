import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  postSignup,
  resetPassword,
  sendSignUpOtp,
} from "@/services/api.helper";
import axios from "axios";
import { showToast } from "@/services/toastConfig";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function OTPVerify() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 5);
  const [isIndicator, setIsIndicator] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.push(
                params?.preScreen === "forgot_password"
                  ? "/forgot_password"
                  : "/signup"
              )
            }
          >
            <Icon
              name="arrow-left-thin"
              color={Colors.text.secondary}
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Enter your verification code</Text>
          <Text style={styles.subtitle}>
            Please enter the 6-digit code we just sent to your email
          </Text>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <View>
              <Text style={styles.email}>
                {params?.userEmail || params?.phone}{" "}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={async () => {
                  const sign =
                    (await AsyncStorage.getItem("user_signup")) || "";
                  const data = JSON.parse(sign);
                  router.push({
                    pathname:
                      params?.preScreen === "forgot_password"
                        ? "/forgot_password"
                        : "/signup",
                    params: {
                      preScreen: "otp_verify",
                      toggleBtn: "edit",
                      name: data?.name,
                      email: data?.email || data?.userEmail,
                      phone: data?.phone,
                      password: data?.password,
                      isTerms: data?.isTerms,
                    },
                  });
                }}
              >
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.otpContainer}>
          <OtpInput
            numberOfDigits={6}
            focusColor={`${Colors.primary}`}
            type="numeric"
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            onFilled={async (text) => {
              try {
                setIsIndicator(true);
                let res;
                if (params?.preScreen === "signup") {
                  const sign =
                    (await AsyncStorage.getItem("user_signup")) || "";
                  const data = JSON.parse(sign);
                  const payload = {
                    name: data?.name,
                    email: data?.email || data?.userEmail,
                    phone: data?.phone,
                    password: data?.password,
                    fcm_token: "eEwFK5JhQzCYjXQMb0jzLN:APA91bFq3",
                    otp: text,
                  };
                  res = await postSignup(payload);
                  await AsyncStorage.removeItem("user_signup");
                } else if (params?.preScreen === "forgot_password") {
                  const payload = {
                    email: params?.email || params?.userEmail,
                    otp: text,
                    action: "reset_password",
                  };
                  res = await postSignup(payload);
                  if (res?.status === 200) {
                    router.push({
                      pathname: "/update_password",
                      params: {
                        ...params,
                        otp: text,
                        action: "reset_password",
                      },
                    });
                    return;
                  }
                  showToast("error", res?.msg);
                  return
                }
                if (res?.statusCode === 400) {
                  showToast("error", res?.message);
                } else if (res?.statusCode === 409) {
                  showToast("error", res?.message);
                } else if (res?.accessToken) {
                  await AsyncStorage.setItem("token", res?.accessToken);
                  showToast("success", "OTP verified successfully");
                  router.push(
                    params?.preScreen === "forgot_password"
                      ? "/update_password"
                      : "/user_profile"
                  );
                }
              } catch (error) {
                if (axios.isAxiosError(error)) {
                  showToast(
                    "error",
                    error.response?.data?.message ||
                      "OTP verification failed, Please try again."
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
          />
          <View style={{ marginTop: 30, flexDirection: "row", gap: 5 }}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ color: Colors.text.tertiary }}>
                Resend Code in
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              {isTimeExpired ? (
                <View>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const sign =
                          (await AsyncStorage.getItem("user_signup")) || "";
                        const data = JSON.parse(sign);
                        const res = await sendSignUpOtp({
                          emailOrPhone:
                            params?.userEmail || params?.phone || data?.email,
                        });
                        showToast(
                          "success",
                          res?.message || "OTP sent successfully!"
                        );
                        setTimeLeft(60 * 3);
                        setIsTimeExpired(false);
                      } catch (error) {
                        if (axios.isAxiosError(error)) {
                          console.log(error.response?.data);
                          showToast(
                            "error",
                            error.response?.data?.message ||
                              "OTP sent failed, Please try again."
                          );
                        } else {
                          showToast(
                            "error",
                            "An unexpected error occurred. Please try again."
                          );
                        }
                      }
                    }}
                  >
                    <Text style={styles.edit}>Resend</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={{ color: Colors.text.secondary }}>
                    {Math.floor(timeLeft / 60)}:
                    {String(timeLeft % 60).padStart(2, "0")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        {isIndicator && <LoadingOverlay message="Verifying OTP..." />}
      </View>
    </SafeAreaView>
  );
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
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
  email: {
    fontWeight: 700,
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 14,
    color: Colors.text.primary,
  },
  edit: {
    fontWeight: 700,
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 14,
    color: Colors.error,
    textDecorationLine: "underline",
  },
  otpContainer: {
    marginTop: 30,
  },
});
