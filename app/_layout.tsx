import { Stack } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import userStore from "@/store/userStore";
import { AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { getProfile } from "@/hooks/userProfile";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    console.log("session refreshed");
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Root() {
  const { session: currentSession } = userStore((state) => state);
  const router = useRouter();

  const askNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      console.log("Notification permissions granted.");
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
        // Redirect to sign-in if session is null (logged out)
        router.replace("/sign-in");
      } else {
        getProfile(session.user.id);
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
