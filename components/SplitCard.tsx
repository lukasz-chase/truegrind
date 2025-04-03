import SwipeToDelete from "@/components/SwipeToDelete"; // <-- The new component
import { AppColors } from "@/constants/colors";
import { deleteSplit } from "@/lib/splitsServices";
import { updateUserProfile } from "@/lib/userService";
import { Split } from "@/types/split";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  split: Split;
  userId: string;
  refetchData: () => void;
  isActiveSplit: boolean;
  removeLocalSplit: (splitId: string) => void;
};

const SplitCard = ({
  split,
  userId,
  refetchData,
  isActiveSplit,
  removeLocalSplit,
}: Props) => {
  const router = useRouter();

  const chooseSplitHandler = () => {
    if (!isActiveSplit) router.push("/");
    updateUserProfile(userId, { active_split_id: split.id });
    refetchData();
    router.push("/");
  };

  const deleteSplitHandler = async () => {
    if (isActiveSplit) {
      await updateUserProfile(userId, { active_split_id: null });
    }
    await deleteSplit(split.id);
    removeLocalSplit(split.id);
  };

  return (
    <SwipeToDelete
      onDelete={deleteSplitHandler}
      enabled={split.user_id === userId}
    >
      <View
        style={[
          styles.splitCard,
          { backgroundColor: isActiveSplit ? AppColors.blue : AppColors.white },
        ]}
      >
        <Pressable onPress={chooseSplitHandler} style={{ gap: 5 }}>
          <Text
            style={[
              styles.splitTitle,
              { color: isActiveSplit ? AppColors.white : AppColors.black },
            ]}
          >
            {split.name}
          </Text>
          {split.frequency && (
            <Text style={styles.frequency}>{split.frequency}</Text>
          )}
          {split.description && (
            <Text style={styles.description}>{split.description}</Text>
          )}
        </Pressable>
      </View>
    </SwipeToDelete>
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
  },
  frequency: {
    fontSize: 16,
    color: AppColors.darkGray,
  },
  description: {
    fontSize: 16,
  },
});

export default SplitCard;
