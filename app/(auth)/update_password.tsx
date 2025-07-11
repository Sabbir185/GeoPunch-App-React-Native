import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import Button from "@/components/common/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { resetPassword } from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const signUpSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function UpdatePassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isIndicator, setIsIndicator] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsIndicator(true);
      const payload = {
        emailOrPhone:
          params?.toggleBtn === "email" ? params?.userEmail : params?.phone,
        newPassword: data?.password,
        otp: params?.otp,
      };
      const res = await resetPassword(payload);
      if (res?.statusCode === 400) {
        showToast("error", res?.message);
        return;
      } else {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user_signup");
        showToast("success", res?.message || "OTP sent successfully");
        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.message ||
            "Password update failed. Please try again."
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
            {/* text info */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Please create a new password to login into your account
              </Text>
            </View>

            {/* input form */}
            {/* Password Input */}
            <View>
              <Text style={styles.label}>New Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      placeholder="*******"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => setShowPassword(!showPassword)}
                            >
                              <Icon
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                              />
                            </TouchableOpacity>
                          )}
                        />
                      }
                      style={styles.input}
                      outlineColor={Colors.boarder}
                      activeOutlineColor={Colors.light}
                    />
                    {errors.password && (
                      <Text style={styles.errorText}>
                        {errors.password.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>Confirm New Password</Text>
              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      placeholder="*******"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      secureTextEntry={!showConfirmPassword}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              <Icon
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={20}
                              />
                            </TouchableOpacity>
                          )}
                        />
                      }
                      style={styles.input}
                      outlineColor={Colors.boarder}
                      activeOutlineColor={Colors.light}
                    />
                    {errors.confirm_password && (
                      <Text style={styles.errorText}>
                        {errors.confirm_password.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Submit Button */}
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <Button
                onPress={handleSubmit(onSubmit)}
                title="Update Password"
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
            </View>
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
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  textContainer: {
    marginTop: deviceHeight < 750 ? 45 : 120,
    marginBottom: 30,
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
    marginTop: 10,
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
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
});
