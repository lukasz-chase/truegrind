import CustomHeader from "@/components/CustomHeader";
import { deleteAuthUser } from "@/lib/userService";
import useActionModal from "@/store/useActionModal";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import * as AuthSession from "expo-auth-session";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppleHealthKit, { HealthKitPermissions } from "react-native-health";

const discovery = {
  authorizationEndpoint: "https://www.strava.com/oauth/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
};

/* Permission options */
const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
  },
};

const Integrations = () => {
  const { user } = userStore((s) => s);
  const [loading, setLoading] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [healthConnected, setHealthConnected] = useState(false);
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID ?? "",
      scopes: ["read", "activity:write"],
      responseType: AuthSession.ResponseType.Code,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    },
    discovery
  );

  useEffect(() => {
    const checkConnections = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Check Strava
        const { data, error } = await supabase
          .from("strava_integrations")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;
        setStravaConnected(!!data);

        // Check Apple Health
        if (Platform.OS === "ios") {
          AppleHealthKit.getAuthStatus(permissions, (err, results) => {
            if (err) {
              console.error("Error getting Apple Health auth status:", err);
              return;
            }
            // Check if we have at least one write permission
            setHealthConnected(results.permissions.write.includes(1));
          });
        }
      } catch (err) {
        console.error("Failed to check connections:", err);
      } finally {
        setLoading(false);
      }
    };

    checkConnections();
  }, [user]);

  useEffect(() => {
    const exchangeCodeForToken = async (code: string) => {
      if (!user) return;
      setLoading(true);
      try {
        const { error } = await supabase.functions.invoke("strava-auth", {
          body: { code, userId: user.id },
        });
        if (error) throw error;
        setStravaConnected(true);
      } catch (err) {
        console.error("Failed to exchange Strava code for token:", err);
      } finally {
        setLoading(false);
      }
    };

    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    } else if (response?.type === "error") {
      console.error("Strava Auth Error:", response.error);
      setLoading(false);
    }
  }, [response, user]);

  const handleStravaPress = async () => {
    if (stravaConnected) {
      setLoading(true);
      try {
        await supabase.functions.invoke("strava-deauth", {
          body: { userId: user!.id },
        });
        setStravaConnected(false);
      } catch (e) {
        console.error("Failed to disconnect Strava:", e);
      } finally {
        setLoading(false);
      }
    } else {
      await promptAsync();
    }
  };

  const handleHealthPress = () => {
    if (Platform.OS !== "ios") return;

    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        console.log("[ERROR] Cannot grant permissions!");
        return;
      }
      setHealthConnected(true);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.verticallySpaced}>
        <CustomHeader name="Integrations" href="/profile" />
        <Pressable
          onPress={handleStravaPress}
          disabled={loading || !request}
          style={[
            styles.button,
            styles.stravaButton,
            (loading || !request) && styles.buttonDisabled,
            stravaConnected && { backgroundColor: theme.red },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Loading..."
              : stravaConnected
              ? "Disconnect from Strava"
              : "Connect with Strava"}
          </Text>
        </Pressable>

        {Platform.OS === "ios" && (
          <Pressable
            onPress={handleHealthPress}
            disabled={healthConnected}
            style={[
              styles.button,
              styles.healthButton,
              healthConnected && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {healthConnected
                ? "Connected to Apple Health"
                : "Connect to Apple Health"}
            </Text>
          </Pressable>
        )}
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
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    stravaButton: {
      backgroundColor: "#FC4C02",
    },
    healthButton: {
      backgroundColor: theme.black,
      borderWidth: 1,
      borderColor: theme.white,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: theme.white, fontSize: 16, fontWeight: "600" },
  });
