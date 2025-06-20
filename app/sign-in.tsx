import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { setProfileInUserStore } from "@/lib/userService";
import CustomTextInput from "@/components/CustomTextInput";
import { ThemeColors } from "@/types/user";
import useThemeStore from "@/store/useThemeStore";
import { prepareInitialFolders } from "@/lib/splitsServices";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  async function signInWithEmail() {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (data?.user) setProfileInUserStore(data.user.id);
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!email || !password) return Alert.alert("Inputs cant be empty");
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: "User",
          custom_timers: [60, 120, 180, 240],
        },
      },
    });
    if (session) {
      await prepareInitialFolders(session!.user.id);
    }
    console.log(error);
    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>true</Text>
        <Text style={styles.title}>grind</Text>
      </View>
      <View style={styles.inputsContainer}>
        <CustomTextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          size="md"
          placeholder="Email"
          keyboardType="email-address"
        />
        <CustomTextInput
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          size="md"
          value={password}
          secureTextEntry
        />
      </View>
      {loading ? (
        <ActivityIndicator color={theme.white} />
      ) : (
        <>
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            onPress={signInWithEmail}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
          <Pressable
            style={[
              styles.buttonOutline,
              loading && styles.buttonOutlineDisabled,
            ]}
            disabled={loading}
            onPress={signUpWithEmail}
          >
            <Text style={[styles.buttonText, { color: theme.blue }]}>
              Sign Up
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      textAlign: "left",
      fontSize: 60,
      fontWeight: "bold",
      color: theme.textColor,
      marginBottom: 10,
      textTransform: "uppercase",
    },
    inputsContainer: {
      width: "100%",
      marginBottom: 20,
      gap: 10,
    },
    button: {
      width: "100%",
      backgroundColor: theme.blue,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 10,
    },
    buttonText: {
      color: theme.white,
      fontSize: 24,
      textTransform: "uppercase",
      fontWeight: "bold",
    },
    buttonDisabled: {
      backgroundColor: theme.blue,
    },
    buttonOutline: {
      width: "100%",
      paddingVertical: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.blue,
      alignItems: "center",
    },
    buttonOutlineDisabled: {
      borderColor: theme.blue,
      color: theme.blue,
    },
  });
