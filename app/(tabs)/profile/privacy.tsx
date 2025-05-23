import CustomHeader from "@/components/CustomHeader";
import { deleteAuthUser } from "@/lib/userService";
import useActionModal from "@/store/useActionModal";
import userStore from "@/store/userStore";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Privacy() {
  const { user } = userStore((state) => state);
  const [loading, setLoading] = useState(false);
  const { openModal } = useActionModal();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const deleteAccountHandler = async () => {
    setLoading(true);
    if (!user) throw new Error("No user on the session!");

    await deleteAuthUser(user.id);
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
        <Text style={{ color: theme.textColor }}>
          TrueGrind Privacy Policy Thank you for using TrueGrind. At TrueGrind
          Fitness PTE Ltd. (" Company", "we", "us", "our"), we are committed to
          protecting your personal information and your right to privacy. When
          you visit our website (the " Website"), use our mobile application
          (the "App", "TrueGrind") and more generally, use any of our services
          (the "Services", which include the Website and App), we appreciate
          that you are trusting us with your personal information. We store our
          own workout information in TrueGrind, just as you do. This document
          outlines our stance on privacy for TrueGrind. We encourage you to read
          this document carefully. If there are any conditions that you do not
          agree with, please discontinue use of the Services. Data We Collect
          Personal Data and your TrueGrind Account You are required to provide
          basic personal information such as Name (Optional) and Email Address
          in order to create a TrueGrind Account. We encourage you to use your
          primary email to sign up for TrueGrind to ensure your continued access
          to your own data. You can also use a third party login such as Sign in
          with Apple or Facebook. If you lose access to your email or third
          party login, you will lose access to your TrueGrind account. We cannot
          restore or change email addresses for security reasons. Your Workout
          Data TrueGrind is a workout tracking app and platform. You enter your
          Workout Data (consisting of training information such as your workout
          activity data, exercises performed, body measurements etc.) into
          TrueGrind. We consider this to be your data. Managing and Exporting
          Your Data You can export your Workout Data to a spreadsheet friendly
          .csv format from the iPhone or Android apps. To export the entirety of
          your Personal Data (including Settings), please contact us from inside
          the app.
        </Text>

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
      backgroundColor: theme.red,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: theme.white, fontSize: 16, fontWeight: "600" },
  });
