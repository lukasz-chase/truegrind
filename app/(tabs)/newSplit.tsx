import CustomTextInput from "@/components/CustomTextInput";
import { AppColors } from "@/constants/colors";
import { createSplit } from "@/lib/splitsServices";
import { updateUserProfile } from "@/lib/userService";
import useAppStore from "@/store/useAppStore";
import userStore from "@/store/userStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import useSplitsStore from "@/store/useSplitsStore";
import CustomHeader from "@/components/CustomHeader";

export default function NewSplitScreen() {
  const [splitName, setSplitName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");

  const { user } = userStore();
  const { refetchData } = useAppStore();
  const { addSplit } = useSplitsStore();

  const router = useRouter();

  const goBackHandler = () => {
    router.push("/splits");
  };

  const createSplitHandler = async () => {
    if (!splitName) return;
    const data = await createSplit({
      name: splitName,
      user_id: user!.id,
      description,
      frequency,
    });
    if (data) {
      addSplit(data);
      updateUserProfile(user!.id, { active_split_id: data.id });
      refetchData();
      router.push("/");
      setSplitName("");
      setDescription("");
      setFrequency("");
    }
  };

  if (!user) return null;
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader name="New Split" href="/splits" />
      <CustomTextInput
        onChangeText={setSplitName}
        value={splitName}
        placeholder="Split Name*"
      />
      <CustomTextInput
        onChangeText={setFrequency}
        value={frequency}
        placeholder="Frequency. eg: 3-4 times a week"
      />
      <CustomTextInput
        onChangeText={setDescription}
        value={description}
        placeholder="Description"
        size="lg"
      />
      <Pressable
        style={[styles.actionButton, { opacity: !splitName ? 0.5 : 1 }]}
        onPress={createSplitHandler}
        disabled={!splitName}
      >
        <Text style={styles.actionButtonText}>Create</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
  actionButton: {
    padding: 10,
    backgroundColor: AppColors.blue,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  actionButtonText: {
    color: AppColors.white,
    fontSize: 20,
  },
});
