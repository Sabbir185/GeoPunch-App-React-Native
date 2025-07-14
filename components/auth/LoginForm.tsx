import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import Button from "../common/Button";
import { useRouter } from "expo-router";
import axios from "axios";
import { showToast } from "@/services/toastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@/contexts/user";
import config from "@/config";

interface ILoginFormData {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { fetchUserProfile } = useContext(UserContext);
  const [isIndicator, setIsIndicator] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: ILoginFormData) => {
    try {
      setIsIndicator(true);
      const payload = {
        email: data.email,
        password: data.password,
        fcm_token: "eEwFK5JhQzCYjXQMb0jzLN:APA91bFq3",
        device: "mobile",
      };

      const res = await axios.post(config?.API_URL + "/auth/login", payload);

      if (res?.data?.isDeleted) {
        Alert.alert(
          "Account Deleted",
          "Your account has been deleted. Please contact support for assistance."
        );
        return;
      }

      if (res?.data?.data?.accessToken) {
        try {
          await AsyncStorage.setItem("token", res?.data?.data?.accessToken);
          showToast("success", "Login successful!");
          await fetchUserProfile();
          router.push("/(home)");
        } catch (e) {
          showToast(
            "error",
            res?.data?.msg || "Login failed. Please try again."
          );
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        showToast(
          "error",
          error.response?.data?.msg || "Login failed. Please try again."
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
      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              //   label="Email"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              left={
                <TextInput.Icon icon={() => <Icon name="email" size={20} />} />
              }
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              outlineColor={Colors.boarder}
              activeOutlineColor={Colors.light}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
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
              //   label="*******"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              placeholder="*******"
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
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </>
        )}
      />

      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity
          onPress={() => router.push("/forgot_password")}
          style={{ alignSelf: "flex-end" }}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        title="Log in"
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
        isIndicator={isIndicator}
      >
        Log in
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
    fontWeight: 500,
    marginBottom: 5,
  },
  forgotPassword: {
    color: Colors.text.secondary,
    fontFamily: Fonts.Satoshi,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 20,
    textAlign: "right",
  },
});

export default LoginForm;
