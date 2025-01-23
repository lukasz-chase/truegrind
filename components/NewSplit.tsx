import { useState } from "react";
import CustomTextInput from "./CustomTextInput";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppColors } from "@/constants/colors";
import { createSplit } from "@/lib/splitsServices";
import { useRouter } from "expo-router";
import { updateUserProfile } from "@/lib/userService";

type Props = {
  userId: string;
  refetchData: () => void;
};

const NewSplit = ({ refetchData, userId }: Props) => {
  const [splitName, setSplitName] = useState("");

  const router = useRouter();

  const createSplitHandler = async () => {
    const data = await createSplit({ name: splitName, user_id: userId });
    if (data) {
      updateUserProfile(userId, { active_split_id: data.id });
      refetchData();
      router.push("/");
      setSplitName("");
    }
  };
  return (
    <View style={styles.wrapper}>
      <CustomTextInput
        onChangeText={setSplitName}
        value={splitName}
        placeholder="Split Name"
      />
      <Pressable style={styles.actionButton} onPress={createSplitHandler}>
        <Text style={styles.actionButtonText}>Create</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    minHeight: 150,
    borderWidth: 1,
    borderColor: AppColors.blue,
    marginTop: 10,
    justifyContent: "center",
  },
  actionButton: {
    padding: 10,
    backgroundColor: AppColors.blue,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 20,
  },
});

export default NewSplit;
