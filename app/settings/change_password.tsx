import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { images } from "@/constants/images";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/common/Button";
import { ScrollView } from "react-native";
import Modal from "react-native-modal";
import { showToast } from "@/services/toastConfig";
import { changePassword } from "@/services/api.helper";
import axios from "axios";

const passwordChangedSchema = z
  .object({
    old_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
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

type passwordChangedFormData = z.infer<typeof passwordChangedSchema>;

export default function ChangePassword() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isIndicator, setIsIndicator] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<passwordChangedFormData>({
    resolver: zodResolver(passwordChangedSchema),
    defaultValues: {
      old_password: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: passwordChangedFormData) => {
    if (!data.old_password || !data.password || !data.confirm_password) {
      showToast("error", "Please fill all fields");
      return;
    }
    try {
      setIsIndicator(true);
      const payload = {
        oldPassword: data.old_password,
        newPassword: data.password,
        confirmNewPassword: data.confirm_password,
      };
      const res = await changePassword(payload);
      if (res?.statusCode === 400) {
        showToast("error", res?.message);
      } else if (res?.statusCode === 401) {
        showToast("error", res?.message);
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.message || "Failed to update, Please try again."
        );
      } else {
        showToast("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsIndicator(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView style={styles.screen}>
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
              <Text style={styles.headerText}>Change Password</Text>
            </View>
          </View>
          {/* body part */}
          {/* input form */}
          <View style={styles.inputContainer}>
            {/* Old Password Input */}
            <View>
              <Text style={styles.label}>Old Password</Text>
              <Controller
                control={control}
                name="old_password"
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
                    {errors.old_password && (
                      <Text style={styles.errorText}>
                        {errors.old_password.message}
                      </Text>
                    )}
                  </>
                )}
              />
              <TouchableOpacity
                onPress={async () => {
                  router.push("/forgot_password");
                  try {
                    await AsyncStorage.removeItem("token");
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <Text
                  style={{
                    textAlign: "right",
                    color: Colors.text.tertiary,
                    fontSize: 14,
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Password Input */}
            <View style={{ marginTop: 20 }}>
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
          </View>
          {/* submit button */}
          <View style={styles.inputSubmitBtn}>
            <Button
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              title="Update"
              button_style={{
                btn: {
                  backgroundColor: Colors.primary,
                  width: "100%",
                  height: 56,
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

        {/* success modal */}
        <Modal
          isVisible={isModalVisible}
          animationIn={"bounceInUp"}
          onBackdropPress={() => setModalVisible(false)}
          onModalWillHide={() => {
            console.log("Modal has been closed");
          }}
        >
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
            <View>
              <Image
                source={images.welcomeElements}
                style={{
                  width: 182,
                  height: 150,
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
                Password Updated
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.UrbanistSemibold,
                  color: Colors.text.primary,
                  fontSize: 24,
                  fontWeight: "600",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Successfully
              </Text>
            </View>
            {/* button */}
            <Button
              title="Close"
              onPress={async () => {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("user");
                setModalVisible(false);
                router.push("/login");
              }}
              button_style={{
                btn: {
                  backgroundColor: Colors.primary,
                  width: "100%",
                  height: 56,
                  marginVertical: 20,
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
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
  inputContainer: {
    marginVertical: 40,
  },
  inputSubmitBtn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    marginBottom: 20,
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
