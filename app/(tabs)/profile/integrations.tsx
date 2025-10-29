import CustomHeader from "@/components/CustomHeader";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import * as AuthSession from "expo-auth-session";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const discovery = {
  authorizationEndpoint: "https://www.strava.com/oauth/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
};

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "trueGrind",
  preferLocalhost: true,
});
const Integrations = () => {
  const { user } = userStore((s) => s);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { theme } = useThemeStore((s) => s);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID ?? "",
      scopes: ["activity:write,read"],
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("strava_integrations")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        setIsConnected(!!data);
      } catch (err) {
        console.error("Failed to check Strava connection:", err);
      } finally {
        setLoading(false);
      }
    };

    const exchangeCodeForToken = async (code: string) => {
      if (!user) return;
      setLoading(true);
      try {
        const { error } = await supabase.functions.invoke("strava-auth", {
          body: { code, userId: user.id },
        });
        if (error) throw error;
        setIsConnected(true);
      } catch (err) {
        console.error("Failed to exchange Strava code for token:", err);
      } finally {
        setLoading(false);
      }
    };

    if (response?.type === "success") {
      const params = response.params as Record<string, string>;
      const code = params?.code;
      if (code) exchangeCodeForToken(code);
      else setLoading(false);
    } else if (response?.type === "error") {
      console.error("Strava Auth Error:", (response as any)?.error);
      setLoading(false);
    }

    checkConnection();
  }, [response, user]);

  const handleDisconnect = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("strava-deauth", {
        body: { userId: user.id },
      });
      if (error) throw error;
      setIsConnected(false);
    } catch (e) {
      console.error("Failed to disconnect Strava:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async () => {
    if (isConnected) {
      await handleDisconnect();
    } else {
      promptAsync({ useProxy: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.verticallySpaced}>
        <CustomHeader name="Integrations" href="/profile" />
        <Pressable
          onPress={handlePress}
          disabled={loading || !request}
          style={[
            styles.button,
            (loading || !request) && styles.buttonDisabled,
            isConnected && { backgroundColor: theme.red },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Loading..."
              : isConnected
              ? "Disconnect from Strava"
              : "Connect with Strava"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Integrations;

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      padding: 20,
      gap: 10,
      backgroundColor: theme.background,
    },
    verticallySpaced: {
      width: "100%",
    },
    button: {
      marginTop: 24,
      backgroundColor: "#FC4C02",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: theme.white, fontSize: 16, fontWeight: "600" },
  });
