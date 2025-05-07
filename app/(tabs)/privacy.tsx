import CustomHeader from "@/components/CustomHeader";
import CustomTextInput from "@/components/CustomTextInput";
import { AppColors } from "@/constants/colors";
import { deleteAuthUser, updateUserProfile } from "@/lib/userService";
import useActionModal from "@/store/useActionModal";
import userStore from "@/store/userStore";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Privacy() {
  const { user } = userStore((state) => state);
  const [loading, setLoading] = useState(false);
  const { openModal } = useActionModal();
  const deleteAccountHandler = async () => {
    setLoading(true);
    if (!user) throw new Error("No user on the session!");

    // await deleteAuthUser(user.id);
    setLoading(false);
  };
  const openActionModal = () => {
    openModal({
      onProceed: deleteAccountHandler,
      proceedButtonLabeL: "Delete",
      title: "Delete account",
      subtitle:
        "Are you sure you want to delete your account? This is irreversible.",
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.verticallySpaced}>
        <CustomHeader name="Privacy" href="/profile" />
        <Text>Bla, bla bla</Text>
        <Text>Privacy</Text>

        <Pressable
          onPress={openActionModal}
          disabled={loading}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Delete account</Text>
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
    backgroundColor: AppColors.red,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: AppColors.white, fontSize: 16, fontWeight: "600" },
});
