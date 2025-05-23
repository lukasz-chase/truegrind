import { Stack } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";
import useActiveWorkout from "@/store/useActiveWorkout";
import useMeasurementsStore from "@/store/useMeasurementsStore";
import { setProfileInUserStore } from "@/lib/userService";
import { Alert, AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import useThemeStore from "@/store/useThemeStore";
import { AppThemeEnum } from "@/types/user";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

AppState.addEventListener("change", (state) => {
  if (state === "active") supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});

export default function RootLayout() {
  const { session } = userStore((s) => s);
  const { resetActiveWorkout } = useActiveWorkout();
  const { resetMeasurements } = useMeasurementsStore();
  const { mode } = useThemeStore();
  const askNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      console.log("Notification permissions granted.");
    }
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to grant notification permissions to use this feature."
      );
    }
  };

  useEffect(() => {
    setStatusBarStyle(
      mode === AppThemeEnum.DARK ? AppThemeEnum.LIGHT : AppThemeEnum.DARK
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      userStore.setState({ session });
      SplashScreen.hideAsync();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      userStore.setState({ session });

      if (!session) {
        resetActiveWorkout();
        resetMeasurements();
      } else {
        setProfileInUserStore(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      askNotificationPermission();
    }
  }, []);

  return (
    <>
      <Stack>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar
        style={
          mode === AppThemeEnum.DARK ? AppThemeEnum.LIGHT : AppThemeEnum.DARK
        }
      />
    </>
  );
}
