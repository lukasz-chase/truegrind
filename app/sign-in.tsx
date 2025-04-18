import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { AppColors } from "@/constants/colors";
import { setProfileInUserStore } from "@/lib/userService";
import CustomTextInput from "@/components/CustomTextInput";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
          custom_timers: [60, 120, 180, 240],
        },
      },
    });
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
        <ActivityIndicator color={AppColors.white} />
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
            <Text style={[styles.buttonText, { color: AppColors.blue }]}>
              Sign Up
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    textAlign: "left",
    fontSize: 60,
    fontWeight: "bold",
    color: AppColors.black,
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
    backgroundColor: AppColors.blue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: AppColors.blue,
  },
  buttonOutline: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.blue,
    alignItems: "center",
  },
  buttonOutlineDisabled: {
    borderColor: AppColors.blue,
    color: AppColors.blue,
  },
});
