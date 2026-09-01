import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { Skeleton } from "@rneui/themed";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { images } from "@/constants/images";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useContext } from "react";
import { UserContext } from "@/contexts/user";
import Constants from "expo-constants";

function TabIconItem({ focused, icon }: { focused: boolean; icon: any }) {
  return (
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: focused ? Colors.primary : "rgba(255, 255, 255, 0.08)",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        shadowColor: focused ? Colors.primary : "transparent",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: focused ? 0.35 : 0,
        shadowRadius: 5,
        elevation: focused ? 4 : 0,
      }}
    >
      <Image
        source={icon}
        style={{ width: "100%", height: "100%" }}
        tintColor={focused ? Colors.white : "#94A3B8"}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { user, fetchUserProfile } = useContext(UserContext);

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#F8FAFC",
          margin: 20,
          gap: 20,
          marginTop: Constants.statusBarHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/logo/geoLogo.png")}
          style={{ width: 180, height: 180, alignSelf: "center" }}
        />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: {
          fontFamily: Fonts.UrbanistBold,
          fontSize: 11,
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarIconStyle: {
          width: 38,
          height: 38,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0F172A",
          borderRadius: 40,
          marginHorizontal: 20,
          marginBottom: 20,
          height: 72,
          position: "absolute",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.12)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
          paddingTop: 8,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIconItem focused={focused} icon={images.home} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          headerShown: false,
          tabBarLabel: "Activity",
          tabBarIcon: ({ focused }) => (
            <TabIconItem focused={focused} icon={images.activities} />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          headerShown: false,
          tabBarLabel: "More",
          tabBarIcon: ({ focused }) => (
            <TabIconItem focused={focused} icon={images.more} />
          ),
        }}
      />
    </Tabs>
  );
}
