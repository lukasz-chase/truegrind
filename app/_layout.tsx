import { Stack } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import userStore from "@/store/userStore";
import { Alert, AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { setProfileInUserStore } from "@/lib/userService";
import useActiveWorkout from "@/store/useActiveWorkout";
import useMeasurementsStore from "@/store/useMeasurementsStore";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Root() {
  const { session: currentSession } = userStore((state) => state);
  const { resetActiveWorkout } = useActiveWorkout();
  const { resetMeasurements } = useMeasurementsStore();
  const router = useRouter();

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
    // Set the status bar style once the component is mounted
    setStatusBarStyle("dark");

    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      userStore.setState({ session });

      // After fetching the session, hide the splash screen
      SplashScreen.hideAsync();
    });

    // Set up a listener for authentication state changes
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      userStore.setState({ session });
      if (!session) {
        resetActiveWorkout();
        resetMeasurements();
        // Redirect to sign-in if session is null (logged out)
        router.replace("/sign-in");
      } else {
        setProfileInUserStore(session.user.id);

        // Redirect to tabs if session exists (logged in)
        router.replace("/(tabs)");
      }
    });

    // Clean up the listener on unmount
    return () => {
      authListener?.data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (Platform.OS === "web") return;
    askNotificationPermission();
  }, []);
  return (
    <>
      <Stack>
        {currentSession ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
