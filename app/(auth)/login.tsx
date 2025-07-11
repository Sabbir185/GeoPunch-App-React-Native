import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.screen}>
        <KeyboardAvoidingView style={styles.screen}>
          <View style={styles.container}>
            {/* logo */}
            <View style={styles.logoContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/logo/geoLogo.png")}
                  style={styles.logo}
                />
              </View>
              {/* <View>
                <Text style={styles.logoTest}>GeoPunch</Text>
              </View> */}
            </View>

            {/* text info */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Log in</Text>
              <Text style={styles.subtitle}>
                Please Enter Log In Details Below
              </Text>
            </View>

            {/* input form */}
            <View style={styles.formContainer}>
              <LoginForm />
              {/* <View style={styles.signUp}>
                <Text>New to GPS Tracking?</Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signUpText}>Create an account</Text>
                </TouchableOpacity>
              </View> */}
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
    flexDirection: "column",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: "100%",
    height: 92,
    marginTop: deviceHeight < 750 ? 60 : 128,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  logoTest: {
    fontWeight: 700,
    fontFamily: Fonts.Satoshi,
    fontSize: 20,
    color: Colors.primary,
    textAlign: "center",
    marginTop: 5,
  },
  titleContainer: {
    marginTop: 30,
  },
  title: {
    fontWeight: 600,
    fontFamily: Fonts.Urbanist,
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
  },
  signUpText: {
    color: Colors.primary,
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 14,
  },
});
