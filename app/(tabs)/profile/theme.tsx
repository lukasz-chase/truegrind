import CustomHeader from "@/components/CustomHeader";
import CustomTextInput from "@/components/CustomTextInput";
import CustomSelect from "@/components/Modals/CustomSelect";
import { AppColors } from "@/constants/colors";
import { updateUserProfile } from "@/lib/userService";
import userStore from "@/store/userStore";
import { AppThemeEnum } from "@/types/user";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Theme() {
  const { user } = userStore((state) => state);

  const [theme, setTheme] = useState(AppThemeEnum.DARK);
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    setLoading(true);
    if (!user) throw new Error("No user on the session!");

    await updateUserProfile(user.id, { theme });
    setLoading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.verticallySpaced}>
        <CustomHeader name="App Theme" href="/profile" />
        <Text>Theme</Text>
        <CustomSelect
          data={[
            { value: AppThemeEnum.LIGHT, label: "Light" },
            { value: AppThemeEnum.DARK, label: "Dark" },
          ]}
          selectedValue={theme}
          setSelectedValue={setTheme}
          buttonLabel="Select theme"
          anchor="LEFT"
          size="lg"
        />

        <Pressable
          onPress={updateProfile}
          disabled={loading}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading ..." : "Update"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  verticallySpaced: {
    width: "100%",
  },
  button: {
    marginTop: 24,
    backgroundColor: AppColors.graphiteGray,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: AppColors.white, fontSize: 16, fontWeight: "600" },
});
