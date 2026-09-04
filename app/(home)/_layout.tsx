import { Tabs } from "expo-router";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { images } from "@/constants/images";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useContext } from "react";
import { UserContext } from "@/contexts/user";
import Constants from "expo-constants";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_CONFIG: Record<string, { label: string; icon: any }> = {
  index: {
    label: "Home",
    icon: images.home,
  },
  activity: {
    label: "Activity",
    icon: images.activities,
  },
  more: {
    label: "More",
    icon: images.more,
  },
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarContainer} pointerEvents="box-none">
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              testID={descriptors[route.key]?.options?.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.8}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconCircle,
                  isFocused && styles.iconCircleFocused,
                ]}
              >
                <Image
                  source={config.icon}
                  style={styles.tabIcon}
                  tintColor={isFocused ? Colors.white : "#94A3B8"}
                />
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  isFocused && styles.tabLabelFocused,
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
          backgroundColor: "#F8FAFC",
          margin: 20,
          gap: 20,
          marginTop: Constants.statusBarHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/logo/gpi-logo-3d.png")}
          style={{ width: 180, height: 180, alignSelf: "center" }}
        />
      </View>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "More",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 36,
    height: 70,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  iconCircleFocused: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  tabIcon: {
    width: "100%",
    height: "100%",
  },
  tabLabel: {
    fontFamily: Fonts.UrbanistBold,
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 3,
    letterSpacing: 0.2,
  },
  tabLabelFocused: {
    color: Colors.primary,
  },
});
