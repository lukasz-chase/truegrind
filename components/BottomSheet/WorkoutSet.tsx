import { View, StyleSheet, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ExerciseSet } from "@/types/exercisesSets";
import CompleteSetButton from "./CompleteSetButton";
import userStore from "@/store/userStore";
import SetHistory from "./SetHistory";
import SetInput from "./SetInput";
import SetOrder from "./SetOrder";
import SwipeToDelete from "@/components/SwipeToDelete";
import useTimerStore from "@/store/useTimer";
import useWorkoutTimerModal from "@/store/useWorkoutTimerModal";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

type Props = {
  exerciseSet: ExerciseSet;
  exerciseId: string;
  exerciseTimer: number | null;
  warmupTimer: number | null;
  updateExerciseSet: (
    exerciseId: string,
    setId: string,
    propertiesToUpdate: Partial<ExerciseSet>
  ) => void;
  deleteExerciseSet: (exerciseId: string, setId: string) => void;
  isEditTemplate?: boolean;
};

const WorkoutSet = ({
  exerciseSet,
  exerciseId,
  exerciseTimer,
  warmupTimer,
  updateExerciseSet,
  deleteExerciseSet,
  isEditTemplate = false,
}: Props) => {
  const rowScale = useSharedValue(1);
  const shakeAnimation = useSharedValue(0);

  const { user } = userStore();
  const { startTimer, endTimer, isRunning } = useTimerStore();
  const { openModal } = useWorkoutTimerModal();
  const { closeKeyboard } = useCustomKeyboard();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [isNoDataInputError, setIsNotDataInputError] = useState(false);

  const updateExerciseSetHandler = (newValue: Partial<ExerciseSet>) => {
    updateExerciseSet(exerciseId, exerciseSet.id, { ...newValue });
  };

  const handleDelete = () => {
    deleteExerciseSet(exerciseId, exerciseSet.id);
  };

  const completeSet = () => {
    closeKeyboard();
    setIsNotDataInputError(false);
    if (!exerciseSet.reps) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      setIsNotDataInputError(true);
      return;
    }
    updateExerciseSetHandler({
      completed: !exerciseSet.completed,
      weight: exerciseSet.weight ? Number(exerciseSet.weight) : 0,
    });
    if (!exerciseSet.completed) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      rowScale.value = withTiming(1.1, { duration: 100 }, () => {
        rowScale.value = withTiming(1, { duration: 100 });
      });
      if (exerciseSet.is_warmup) {
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
  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: rowScale.value,
      },
      { translateX: shakeAnimation.value },
    ],
  }));
  return (
    <SwipeToDelete onDelete={handleDelete}>
      <Animated.View
        style={[
          rowAnimatedStyle,
          styles.row,
          {
            backgroundColor: exerciseSet.completed
              ? theme.lightGreen
              : theme.background,
          },
        ]}
      >
        <View style={[styles.cell, { flex: 0.75 }]}>
          <SetOrder
            isCompleted={exerciseSet.completed}
            order={exerciseSet.order}
            isWarmup={exerciseSet.is_warmup}
            isDropset={exerciseSet.is_dropset}
            exerciseId={exerciseId}
            exerciseSetId={exerciseSet.id}
          />
        </View>
        <View style={[styles.cell, { flex: 1.75 }]}>
          <SetHistory
            exerciseId={exerciseId}
            setOrder={exerciseSet.order}
            userId={user?.id!}
            bulkUpdateSet={updateExerciseSetHandler}
          />
        </View>
        <View style={[styles.cell, { flex: 1.25 }]}>
          <SetInput
            value={exerciseSet.weight}
            completed={exerciseSet.completed}
            exerciseSetId={exerciseSet.id}
            updateSet={updateExerciseSetHandler}
            fieldName="weight"
            rpeValue={exerciseSet.rpe}
            partialsValue={exerciseSet.partials}
            hasCustomTimer={!!exerciseTimer || !!warmupTimer}
            completeSet={completeSet}
            isNoDataInputError={isNoDataInputError}
            barType={exerciseSet.bar_type}
          />
        </View>

        <View style={[styles.cell, { flex: 1.25 }]}>
          <SetInput
            value={exerciseSet.reps}
            completed={exerciseSet.completed}
            exerciseSetId={exerciseSet.id}
            updateSet={updateExerciseSetHandler}
            fieldName="reps"
            rpeValue={exerciseSet.rpe}
            partialsValue={exerciseSet.partials}
            hasCustomTimer={!!exerciseTimer || !!warmupTimer}
            completeSet={completeSet}
            isNoDataInputError={isNoDataInputError}
            barType={exerciseSet.bar_type}
          />
        </View>
        <View style={[styles.cell, { flex: 1, alignItems: "center" }]}>
          <CompleteSetButton
            completeSet={completeSet}
            completed={exerciseSet.completed}
            reps={exerciseSet.reps}
            disabled={isEditTemplate}
          />
        </View>
      </Animated.View>
    </SwipeToDelete>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderRadius: 8,
      overflow: "hidden",
      paddingHorizontal: 10,
      backgroundColor: theme.background,
    },
    cell: {
      paddingVertical: 10,
      textAlign: "center",
      justifyContent: "center",
    },
  });

export default WorkoutSet;
