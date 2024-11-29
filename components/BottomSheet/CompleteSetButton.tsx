import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { AppColors } from "@/constants/colors";
import Animated, { withTiming } from "react-native-reanimated";
import { Platform } from "react-native";
import { ExerciseSet } from "@/types/exercisesSets";
import useTimerStore from "@/store/useTimer";
import useWorkoutTimerModal from "@/store/useWorkoutTimerModal";
import useCustomKeyboard from "@/store/useCustomKeyboard";

type CompleteSetButtonProps = {
  updateExerciseField: (value: any, name: keyof ExerciseSet) => void;
  completed: boolean;
  reps: string;
  rowScale: Animated.SharedValue<number>;
  exerciseTimer: number;
};

const CompleteSetButton: React.FC<CompleteSetButtonProps> = ({
  updateExerciseField,
  completed,
  reps,
  rowScale,
  exerciseTimer,
}) => {
  const { startTimer } = useTimerStore();
  const { openModal } = useWorkoutTimerModal();
  const { closeKeyboard } = useCustomKeyboard();
  const completeSet = () => {
    closeKeyboard();
    updateExerciseField(!completed, "completed");
    if (!completed) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      rowScale.value = withTiming(1.1, { duration: 100 }, () => {
        rowScale.value = withTiming(1, { duration: 100 });
      });
      if (exerciseTimer && exerciseTimer > 0) {
        startTimer(exerciseTimer);
        openModal();
      }
    } else {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: completed ? AppColors.green : AppColors.gray,
          opacity: !reps ? 0.3 : 1,
        },
      ]}
      disabled={!reps}
      onPress={completeSet}
    >
      <AntDesign name="check" size={20} color={completed ? "white" : "black"} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 40,
  },
});

export default CompleteSetButton;
