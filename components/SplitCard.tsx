import { Pressable, StyleSheet, Text } from "react-native";
import { Split } from "@/types/split";
import { AppColors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { updateUserProfile } from "@/lib/userService";

type Props = {
  split: Split;
  userId: string;
  refetchData: () => void;
};

const SplitCard = ({ split, userId, refetchData }: Props) => {
  const router = useRouter();
  const chooseSplitHandler = () => {
    updateUserProfile(userId, { active_split_id: split.id });
    refetchData();
    router.push("/");
  };
  return (
    <Pressable onPress={chooseSplitHandler} style={styles.splitCard}>
      <Text style={styles.splitTitle}>{split.name}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  splitCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: AppColors.blue,
    padding: 20,
    borderRadius: 10,
  },
  splitTitle: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
});

export default SplitCard;
