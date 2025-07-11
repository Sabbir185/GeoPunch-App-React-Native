import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { TextInput, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import Button from "../common/Button";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendSignUpOtp } from "@/services/api.helper";
import axios from "axios";
import { showToast } from "@/services/toastConfig";

const signUpSchema = z
  .object({
    name: z.string().nonempty({ message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().nonempty({ message: "Phone number is required" }),
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

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [isChecked, setChecked] = useState<boolean>(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isIndicator, setIsIndicator] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (params?.name) {
      reset({
        name: params.name || "",
        email: params.email || "",
        password: params.password,
        confirm_password: params.password,
        phone: params.phone || "",
      });
      setChecked(!!params?.isTerms);
    }
  }, [params?.name, params?.phone]);

  const onSubmit = async (data: SignUpFormData) => {
    if (!isChecked) {
      showToast("error", "Please accept terms and conditions");
      return;
    }
    try {
      setIsIndicator(true);
      await AsyncStorage.setItem(
        "user_signup",
        JSON.stringify({ ...data, isTerms: isChecked })
      );
      const res = await sendSignUpOtp({ emailOrPhone: data?.email });
      showToast("success", res?.message || "OTP sent successfully!");
      if (res?.message === "OTP sent successfully") {
        router.push({
          pathname: "/otp_verify",
          params: {
            preScreen: "signup",
            toggleBtn: "email",
            userEmail: data?.email,
            phone: formattedValue,
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        showToast(
          "error",
          error.response?.data?.message || "OTP sent failed, Please try again."
        );
      } else {
        showToast("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsIndicator(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Name Input */}
      <Text style={styles.label}>Full Name</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Enter your full name"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              left={
                <TextInput.Icon
                  icon={() => (
                    <Icon
                      name="account"
                      size={20}
                      color={Colors.text.tertiary}
                    />
                  )}
                />
              }
              style={styles.input}
              outlineColor={Colors.boarder}
              activeOutlineColor={Colors.light}
            />
            {errors.name && (
              <Text style={styles.errorText}>
                {errors.name.message?.toString()}
              </Text>
            )}
          </>
        )}
      />

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="example@email.com"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              left={
                <TextInput.Icon
                  icon={() => (
                    <Icon name="email" size={20} color={Colors.text.tertiary} />
                  )}
                />
              }
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineColor={Colors.boarder}
              activeOutlineColor={Colors.light}
            />
            {errors.email && (
              <Text style={styles.errorText}>
                {errors.email.message?.toString()}
              </Text>
            )}
          </>
        )}
      />

      {/* Phone Input */}
      <Text style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Ex: +91xxxxxxxxxx"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              left={
                <TextInput.Icon
                  icon={() => (
                    <Icon name="phone" size={20} color={Colors.text.tertiary} />
                  )}
                />
              }
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineColor={Colors.boarder}
              activeOutlineColor={Colors.light}
            />
            {errors.phone && (
              <Text style={styles.errorText}>
                {errors?.phone?.message?.toString()}
              </Text>
            )}
          </>
        )}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
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
                      <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
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
                {errors.password.message?.toString()}
              </Text>
            )}
          </>
        )}
      />

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm Password</Text>
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
                {errors.confirm_password.message?.toString()}
              </Text>
            )}
          </>
        )}
      />

      <View
        style={styles.checkboxContainer}
        onTouchStart={() => setChecked(!isChecked)}
      >
        <Checkbox
          value={isChecked}
          // onValueChange={() => setChecked(!isChecked)}
          color={isChecked ? Colors.primary : undefined}
        />
        <Text style={styles.checkboxTextContainer}>
          <Text>By creating an account, you agree to our </Text>
          <Text style={styles.checkboxTextCondition}>Terms and Conditions</Text>
        </Text>
      </View>

      {/* Sign Up Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        title="Sign Up"
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
      >
        Sign Up
      </Button>
    </View>
  );
};

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {},
  input: {
    marginBottom: 15,
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
  checkboxContainer: {
    flexDirection: "row",
    width: deviceWidth < 380 ? 310 : 372,
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  checkboxTextContainer: {
    fontFamily: Fonts.Satoshi,
    fontSize: 14,
    fontWeight: "400",
  },
  checkboxTextCondition: {
    color: Colors.primary,
    fontFamily: Fonts.Satoshi,
    marginLeft: 5,
  },
});

export default SignUpForm;
