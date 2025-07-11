import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import SignUpForm from "@/components/auth/SignupForm";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.screen}>
        <KeyboardAvoidingView style={styles.screen}>
          <View style={styles.container}>
            {/* text info */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>
                Create New GPS Tracking Account
              </Text>
            </View>

            {/* input form */}
            <View style={styles.formContainer}>
              <SignUpForm />
              <View style={styles.signUp}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.signUpText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 30,
  },
  title: {
    fontWeight: "600",
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 24,
    color: Colors.text.primary,
  },
  subtitle: {
    fontWeight: 400,
    fontFamily: Fonts.Urbanist,
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 5,
  },
  formContainer: {
    marginTop: 30,
  },
  signUp: {
    fontWeight: 500,
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    paddingBottom: 20,
  },
  signUpText: {
    color: Colors.primary,
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 14,
  },
});
