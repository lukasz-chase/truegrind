import SwipeToDelete from "@/components/SwipeToDelete"; // <-- The new component
import { deleteSplit } from "@/lib/splitsServices";
import { updateUserProfile } from "@/lib/userService";
import useThemeStore from "@/store/useThemeStore";
import { Split } from "@/types/split";
import { ThemeColors } from "@/types/user";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  split: Split;
  userId: string;
  setRefetchWorkouts: () => void;
  isActiveSplit: boolean;
  removeLocalSplit: (splitId: string) => void;
};

const SplitCard = ({
  split,
  userId,
  setRefetchWorkouts,
  isActiveSplit,
  removeLocalSplit,
}: Props) => {
  const router = useRouter();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const chooseSplitHandler = () => {
    if (!isActiveSplit) router.push("/");
    updateUserProfile(userId, { active_split_id: split.id });
    setRefetchWorkouts();
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
          { backgroundColor: isActiveSplit ? theme.blue : theme.background },
        ]}
      >
        <Pressable onPress={chooseSplitHandler} style={{ gap: 5 }}>
          <Text
            style={[
              styles.splitTitle,
              { color: isActiveSplit ? theme.white : theme.textColor },
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    splitCard: {
      width: "100%",
      borderWidth: 1,
      borderColor: theme.blue,
      padding: 20,
      borderRadius: 10,
    },
    splitTitle: {
      fontWeight: "bold",
      fontSize: 24,
    },
    frequency: {
      fontSize: 16,
      color: theme.textColor,
    },
    description: {
      fontSize: 16,
      color: theme.textColor,
    },
  });

export default SplitCard;
