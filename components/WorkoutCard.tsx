import { Workout } from "@/types/workout";
import { useMemo } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import useWorkoutPreviewModal from "@/store/useWorkoutPreviewModal";
import WorkoutCardContent from "./WorkoutCardContent";

type Props = {
  workout: Workout;
};

const WorkoutCard = ({ workout }: Props) => {
  const { openModal } = useWorkoutPreviewModal();
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    openModal(workout);
  };

  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <TouchableOpacity style={styles.workoutCard} onPress={handlePress}>
      <WorkoutCardContent workout={workout} />
    </TouchableOpacity>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    workoutCard: {
      minHeight: 150,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.lightText,
      padding: 10,
      width: "48%",
    },
  });

export default WorkoutCard;
