import { Stack } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { setStatusBarStyle } from "expo-status-bar";
import { useRouter } from "expo-router";
import userStore from "@/store/userStore";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.requestPermissionsAsync();
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Root() {
  const { session: currentSession } = userStore((state) => state);
  const router = useRouter();
  useEffect(() => {
    // Set the status bar style once the component is mounted
    setStatusBarStyle("dark");

    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      userStore.setState({ session });
    });

    // Set up a listener for authentication state changes
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      userStore.setState({ session });
      if (!session) {
        // Redirect to sign-in if session is null (logged out)
        router.replace("/sign-in");
      } else {
        // Redirect to tabs if session exists (logged in)
        router.replace("/(tabs)");
      }
    });

    // // Clean up the listener on unmount
    return () => {
      authListener?.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <Stack>
      {currentSession ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
