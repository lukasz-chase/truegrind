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
import Octicons from "@expo/vector-icons/Octicons";

type CompleteSetButtonProps = {
  updateStoreSetField: (newValues: Partial<ExerciseSet>) => void;
  completed: boolean;
  reps: number | null;
  rowScale: Animated.SharedValue<number>;
  exerciseTimer: number | null;
  warmupTimer: number | null;
  weight: number | null;
  isWarmup: boolean;
  disabled: boolean;
};

const CompleteSetButton = ({
  updateStoreSetField,
  completed,
  reps,
  rowScale,
  exerciseTimer,
  warmupTimer,
  weight,
  isWarmup,
  disabled,
}: CompleteSetButtonProps) => {
  const { startTimer, endTimer, isRunning } = useTimerStore();
  const { openModal } = useWorkoutTimerModal();
  const { closeKeyboard } = useCustomKeyboard();
  const completeSet = () => {
    closeKeyboard();
    updateStoreSetField({
      completed: !completed,
      weight: weight ? Number(weight) : 0,
    });
    if (!completed) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      rowScale.value = withTiming(1.1, { duration: 100 }, () => {
        rowScale.value = withTiming(1, { duration: 100 });
      });
      if (isWarmup) {
        if (warmupTimer && warmupTimer > 0) {
          startTimer(warmupTimer);
          openModal();
        } else if (!warmupTimer && isRunning) {
          endTimer();
        }
      } else {
        if (exerciseTimer && exerciseTimer > 0) {
          startTimer(exerciseTimer);
          openModal();
        } else if (!exerciseTimer && isRunning) {
          endTimer();
        }
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
      disabled={!reps || disabled}
      onPress={completeSet}
    >
      {disabled ? (
        <Octicons name="dash" size={24} color="black" />
      ) : (
        <AntDesign
          name="check"
          size={20}
          color={completed ? "white" : "black"}
        />
      )}
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
