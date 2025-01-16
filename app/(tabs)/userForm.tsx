import CustomTextInput from "@/components/CustomTextInput";
import { AppColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function userForm() {
  const { user, session } = userStore((state) => state);

  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    setLoading(true);
    if (!session?.user) throw new Error("No user on the session!");

    const updates = {
      id: session?.user.id,
      username,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.verticallySpaced}>
          <Text>Username</Text>
          <CustomTextInput
            onChangeText={setUsername}
            placeholder="Username"
            value={username}
          />
        </View>

        <View style={[styles.verticallySpaced]}>
          <Pressable onPress={updateProfile} disabled={loading}>
            <Text>{loading ? "Loading ..." : "Update"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});
