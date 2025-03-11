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
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#888"
        />
      </View>
      {loading ? (
        <ActivityIndicator color="#fff" />
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
            <Text style={styles.buttonOutlineText}>Sign Up</Text>
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
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 16,
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  buttonOutlineText: {
    color: AppColors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutlineDisabled: {
    borderColor: AppColors.blue,
    color: AppColors.blue,
  },
});
