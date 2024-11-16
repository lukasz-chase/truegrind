import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { StyleSheet, View, Alert } from "react-native";
import userStore from "@/store/userStore";
import { TextField, Button, Text } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { user, session } = userStore((state) => state);
  const [username, setUsername] = useState(user?.username || "");

  async function updateProfile({ username }: { username: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TextField label="Email" value={session?.user?.email} disabled />
        </View>
        <View style={styles.verticallySpaced}>
          <TextField
            label="Username"
            value={username || ""}
            onChangeText={(text) => setUsername(text)}
          />
        </View>

        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            onPress={() => updateProfile({ username })}
            disabled={loading}
          >
            <Text>{loading ? "Loading ..." : "Update"}</Text>
          </Button>
        </View>

        <View style={styles.verticallySpaced}>
          <Button
            onPress={async () => {
              try {
                userStore.setState({ session: null });
                const asd = await supabase.auth.signOut();
                console.log(asd);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Text>Sign Out</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
