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

function TabIcon({ focused, icon, title }: any) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 100,
          backgroundColor: focused ? Colors.primary : "#FFFFFF1A",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: 10,
        }}
      >
        <Image
          source={icon}
          style={{ width: "100%", height: "100%" }}
          tintColor={Colors.white}
        />
      </View>

      <View style={{ width: 100, height: "100%" }}>
        <Text
          style={{
            fontFamily: Fonts.UrbanistSemibold,
            fontWeight: 700,
            fontSize: 12,
            color: focused ? Colors.primary : Colors.white,
            textAlign: "center",
            marginTop: 3,
          }}
        >
          {title}
        </Text>
      </View>
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
          margin: 20,
          gap: 20,
          marginTop: Constants.statusBarHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/logo/geoLogo.png")}
          style={{ width: 200, height: 200, alignSelf: "center" }}
        />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#121A1C",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 20,
          height: 80,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#121A1C",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={images.home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={images.activities}
              title="Activity"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={images.more} title="More" />
          ),
        }}
      />
    </Tabs>
  );
}
