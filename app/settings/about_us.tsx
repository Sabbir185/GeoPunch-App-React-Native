import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Fonts } from "@/constants/Fonts";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import WebView from "react-native-webview";
import { fetchAboutUs } from "@/services/api.helper";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function AboutUs() {
  const router = useRouter();
  const [aboutUs, setAboutUs] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const about = await fetchAboutUs();
      if (about?.content) {
        setAboutUs(about?.content);
      } else {
        setAboutUs("<h1><center>Data Not Found</center></h1>");
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* header part */}
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                router.push("/(home)/more");
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
            <Text style={styles.headerText}>About Us</Text>
          </View>
        </View>
      </View>
      {/* body part */}
      {aboutUs ? (
        <WebView
          style={styles.webViewContainer}
          originWhitelist={["*"]}
          source={{ html: aboutUs }}
        />
      ) : (
        <LoadingOverlay />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  optionsContainer: {
    flexDirection: "column",
    gap: 14,
    marginTop: 50,
  },
  webViewContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
});
