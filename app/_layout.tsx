import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { setStatusBarStyle } from "expo-status-bar";
import { useRouter } from "expo-router";
import userStore from "@/store/userStore";

export default function Root() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  useEffect(() => {
    // Set the status bar style once the component is mounted
    setStatusBarStyle("dark");

    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Set up a listener for authentication state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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
    // return () => {
    //   authListener?.unsubscribe();
    // };
  }, []);

  return (
    <Stack>
      {session ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
