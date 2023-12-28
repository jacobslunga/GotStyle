import { View, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import AppNavigator from "./navigation/AppNavigator";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { HashtagProvider } from "./context/HashtagContext";
import { SelectedOutfitsProvider } from "./context/SelectedOutfits";
import { ShowFollowingProvider } from "./context/ShowFollowing";
import { OutfitLinksProvider } from "./context/OutfitLinks";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const queryClient = new QueryClient();

  const [fontsLoaded] = useFonts({
    logo: require("./assets/fonts/AauxNextBlk.otf"),
    "bas-bold": require("./assets/fonts/basiersquare-bold.ttf"),
    "bas-medium": require("./assets/fonts/basiersquare-medium-webfont.ttf"),
    "bas-regular": require("./assets/fonts/basiersquare-regular-webfont.ttf"),
    "bas-semibold": require("./assets/fonts/basiersquare-semibold-webfont.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <OutfitLinksProvider>
              <ShowFollowingProvider>
                <SelectedOutfitsProvider>
                  <HashtagProvider>
                    <AppNavigator />
                  </HashtagProvider>
                </SelectedOutfitsProvider>
              </ShowFollowingProvider>
            </OutfitLinksProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
