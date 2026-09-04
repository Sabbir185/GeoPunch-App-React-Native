import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";
import { UserContext, UserProvider } from "@/contexts/user";
import { LocationProvider } from "@/contexts/LocationContext";

SplashScreen.preventAutoHideAsync();

function NavigationTree({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isLoading } = useContext(UserContext);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)" options={{ title: "Home" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    UrbanistRegular: require("../assets/fonts/Urbanist.ttf"),
    UrbanistSemibold: require("../assets/fonts/Urbanist-SemiBold.ttf"),
    UrbanistBold: require("../assets/fonts/Urbanist-Bold.ttf"),
    UrbanistItalic: require("../assets/fonts/Urbanist-Italic.ttf"),
    SatoshiRegular: require("../assets/fonts/Satoshi-Regular.otf"),
    SatoshiMedium: require("../assets/fonts/Satoshi-Medium.otf"),
  });

  if (!loaded) {
    return null;
  }

  const GPIConnectTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#F8FAFC",
      card: "#FFFFFF",
      text: "#0F172A",
      border: "#E2E8F0",
    },
  };

  return (
    <ThemeProvider value={GPIConnectTheme}>
      <LocationProvider>
        <UserProvider>
          <NavigationTree fontsLoaded={loaded} />
        </UserProvider>
      </LocationProvider>
      <StatusBar style="dark" />
      <Toast />
    </ThemeProvider>
  );
}
