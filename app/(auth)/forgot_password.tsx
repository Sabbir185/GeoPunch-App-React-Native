import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Fonts } from "@/constants/Fonts";
import Button from "@/components/common/Button";
import PhoneInput from "react-native-phone-number-input";
import { z } from "zod";
import { TextInput } from "react-native-paper";
import { validatePhoneNumber } from "@/utils/mobileValidation";
import { SafeAreaView } from "react-native-safe-area-context";
import { otpForgetPassword } from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";
import axios from "axios";

export default function ForgotPassword() {
  const router = useRouter();
  const [toggleBtn, setToggleBtn] = useState<string>("email");
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [isIndicator, setIsIndicator] = useState(false);
  const [isFieldsFilled, setIsFieldsFilled] = useState({
    email: true,
    phone: true,
  });

  useEffect(() => {
    (async () => {
      if (userEmail && toggleBtn === "email") {
        const isEmail = z.string().email().safeParse(userEmail).success;
        setIsFieldsFilled({ email: isEmail, phone: true });
      }
      if (value && toggleBtn === "phone") {
        const isPhone = validatePhoneNumber(formattedValue, countryCode);
        setIsFieldsFilled({ email: true, phone: isPhone });
      }
    })();
  }, [userEmail, value]);

  const onSubmit = async () => {
    if (!formattedValue && !userEmail) {
      Alert.alert(
        "Invalid Input",
        "Please input a valid email or phone number",
        [{ text: "OK", onPress: () => console.log("Invalid Input") }]
      );
      return;
    }
    try {
      setIsIndicator(true);
      const payload = {
        email: toggleBtn === "email" ? userEmail : formattedValue,
        action: "reset_password"
      };
      const res = await otpForgetPassword(payload);
      if (res?.status !== 200) {
        showToast("error", res?.msg);
        return;
      } else {
        showToast("success", res?.msg || "OTP sent successfully");
        router.push({
          pathname: "/otp_verify",
          params: {
            preScreen: "forgot_password",
            toggleBtn: toggleBtn,
            userEmail: userEmail,
            phone: formattedValue,
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.msg ||
            "OTP verification failed, Please try again."
        );
      } else {
        showToast("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsIndicator(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.screen}>
        <KeyboardAvoidingView style={styles.screen}>
          <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Icon
                  name="arrow-left-thin"
                  color={Colors.text.secondary}
                  size={30}
                />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Urbanist,
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  Forget password
                </Text>
              </View>
            </View>

            {/* title */}
            <View style={{ marginTop: 30 }}>
              <Text style={styles.title}>Forget Your Password</Text>
              <Text style={styles.subtitle}>
                Enter your email to get verification code (OTP)
              </Text>
            </View>

            {/* toggle button */}
            {/* <View
              style={{
                marginTop: 30,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: Colors.boarder,
                padding: 6,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: 5,
              }}
            >
              <Button
                onPress={() => setToggleBtn("email")}
                title="Email"
                button_style={{
                  btn: {
                    backgroundColor:
                      toggleBtn === "email" ? Colors.primary : Colors.white,
                    width: "50%",
                    height: 44,
                  },
                  title: {
                    color:
                      toggleBtn === "email"
                        ? Colors.white
                        : Colors.text.primary,
                    fontFamily: Fonts.SatoshiMedium,
                    fontSize: 18,
                  },
                  indicatorColor: Colors.white,
                }}
              />
            </View> */}

            {/* input form */}
            <View style={{ marginTop: 30 }}>
              {/* Email Input */}
              {toggleBtn === "email" && (
                <>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={userEmail}
                    placeholder="example@email.com"
                    onChangeText={(e) => setUserEmail(e)}
                    mode="outlined"
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Icon
                            name="email"
                            size={20}
                            color={Colors.text.tertiary}
                          />
                        )}
                      />
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    outlineColor={Colors.boarder}
                    activeOutlineColor={Colors.light}
                  />
                  {!isFieldsFilled?.email && (
                    <Text style={styles.errorText}>
                      Please provide a valid email address
                    </Text>
                  )}
                </>
              )}

              {/* Phone Input */}
              {toggleBtn === "phone" && (
                <>
                  <Text style={styles.label}>Phone Number</Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.boarder,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  >
                    <PhoneInput
                      defaultValue={value}
                      defaultCode="IN"
                      layout="first"
                      onChangeText={(text) => {
                        setValue(text);
                      }}
                      onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                      }}
                      withDarkTheme
                      autoFocus
                      containerStyle={{
                        width: "100%",
                        height: 55,
                        backgroundColor: "#fdfafe",
                      }}
                      textContainerStyle={{
                        backgroundColor: "#fdfafe",
                      }}
                      textInputStyle={{
                        margin: 0,
                        padding: 0,
                        height: 55,
                      }}
                      onChangeCountry={(country) => {
                        setCountryCode(country?.cca2);
                      }}
                    />
                  </View>
                  {!isFieldsFilled?.phone && (
                    <Text style={styles.errorText}>
                      Please provide a valid phone number
                    </Text>
                  )}
                </>
              )}
            </View>

            {/* button */}
            {/* Sign Up Button */}
            <Button
              onPress={onSubmit}
              title="Send Me Code"
              button_style={{
                btn: {
                  backgroundColor: Colors.primary,
                  marginTop: 30,
                  marginBottom: 20,
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
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    marginTop: 30,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: Fonts.UrbanistSemibold,
    fontWeight: 600,
    fontSize: 24,
  },
  subtitle: {
    fontFamily: Fonts.SatoshiMedium,
    fontWeight: 400,
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
  },
  label: {
    color: Colors.text.primary,
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
