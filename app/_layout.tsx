import { Stack } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";
import useActiveWorkout from "@/store/useActiveWorkout";
import useMeasurementsStore from "@/store/useMeasurementsStore";
import { setProfileInUserStore } from "@/lib/userService";
import { AppState } from "react-native";
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

export default function RootLayout() {
  const { session } = userStore((s) => s);
  const { resetActiveWorkout } = useActiveWorkout();
  const { resetMeasurements } = useMeasurementsStore();
  const { mode } = useThemeStore();

  useEffect(() => {
    setStatusBarStyle(
      mode === AppThemeEnum.DARK ? AppThemeEnum.LIGHT : AppThemeEnum.DARK,
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
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    return () => subscription.remove();
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
