import { Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomImage from "@/components/CustomImage";
import { useCallback, useMemo, useState } from "react";

import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutSummary from "@/components/WorkoutSummary";
import { useFocusEffect } from "expo-router";
import uuid from "react-native-uuid";
import useAppStore from "@/store/useAppStore";
import useTimerStore from "@/store/useTimer";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import * as Haptics from "expo-haptics";
import { fetchWorkoutsCount } from "@/lib/workoutServices";
import { saveTemplate, UPDATE_TEMPLATE } from "@/constants/actionModal";
import useActionModal from "@/store/useActionModal";
import userStore from "@/store/userStore";
import { getOrdinalSuffix } from "@/utils/calendar";
import { ThemeColors } from "@/types/user";
import { estimateCaloriesBurned } from "@/utils/calories";
import useThemeStore from "@/store/useThemeStore";
import { supabase } from "@/lib/supabase";
import { calculatePRs } from "@/utils/prs";
import { useShallow } from "zustand/shallow";
import { finishWorkout } from "@/lib/finishWorkoutService";

const TrophyImage = require("@/assets/images/trophy.webp");

export default function WorkoutFinishedScreen() {
  const [workoutsCount, setWorkoutsCount] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [PRs, setPRs] = useState(0);

  const {
    activeWorkout,
    initialActiveWorkout,
    workoutWasUpdated,
    isNewWorkout,
    resetActiveWorkout,
    setPersistedStorage,
  } = useActiveWorkout(
    useShallow((state) => ({
      activeWorkout: state.activeWorkout,
      initialActiveWorkout: state.initialActiveWorkout,
      workoutWasUpdated: state.workoutWasUpdated,
      isNewWorkout: state.isNewWorkout,
      resetActiveWorkout: state.resetActiveWorkout,
      setPersistedStorage: state.setPersistedStorage,
    }))
  );
  const setRefetchWorkouts = useAppStore((state) => state.setRefetchWorkouts);
  const endTimer = useTimerStore((state) => state.endTimer);
  const { resetTimer, formattedTime } = useWorkoutTimer(
    useShallow((state) => ({
      resetTimer: state.resetTimer,
      formattedTime: state.formattedTime,
    }))
  );
  const openModal = useActionModal((state) => state.openModal);
  const user = userStore((state) => state.user);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [workout, setWorkout] = useState({
    ...activeWorkout,
    workout_time: formattedTime,
  });

  useFocusEffect(
    useCallback(() => {
      getWorkoutsCount();
      if (activeWorkout.user_id) {
        const filteredWorkout = {
          ...activeWorkout,
          workout_exercises: activeWorkout.workout_exercises?.filter(
            (workoutExercise) => workoutExercise.exercise_sets.length > 0
          ),
        };
        setWorkout({
          ...filteredWorkout,
          workout_time: formattedTime,
        });

        const estimatedCalories = estimateCaloriesBurned(formattedTime, user);
        if (estimatedCalories) {
          setCaloriesBurned(estimatedCalories);
        }
        calculateAndSetPRs(filteredWorkout);
      }
      const exercisesChanged = haveExercisesChanged();
      if (isNewWorkout) {
        openModal({
          onCancel: () => saveWorkout(false),
          onProceed: () => saveWorkout(true),
          subtitle: saveTemplate.subtitle,
          title: saveTemplate.title,
          proceedButtonLabeL: saveTemplate.proceedButtonLabeL,
          cancelButtonLabel: saveTemplate.cancelButtonLabel,
          buttonsLayout: "column",
        });
      } else if (exercisesChanged) {
        openModal({
          onCancel: () => saveWorkout(false),
          onProceed: () => saveWorkout(true),
          subtitle: UPDATE_TEMPLATE.subtitle,
          title: UPDATE_TEMPLATE.title,
          proceedButtonLabeL: UPDATE_TEMPLATE.proceedButtonLabeL,
          cancelButtonLabel: UPDATE_TEMPLATE.cancelButtonLabel,
          buttonsLayout: "column",
        });
      } else {
        saveWorkout(false);
      }
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [activeWorkout, initialActiveWorkout])
  );

  const haveExercisesChanged = () => {
    const initialExercises = initialActiveWorkout.workout_exercises || [];
    const activeExercises = activeWorkout.workout_exercises || [];

    const removedExercises = initialExercises.some((workoutExercise) => {
      return !activeExercises.find(
        (activeWorkoutExercise) =>
          activeWorkoutExercise.id === workoutExercise.id
      );
    });
    const addedExercises = activeExercises.some((activeWorkoutExercise) => {
      return !initialExercises.find(
        (workoutExercise) => workoutExercise.id === activeWorkoutExercise.id
      );
    });

    return removedExercises || addedExercises;
  };
  const getWorkoutsCount = async () => {
    const count = await fetchWorkoutsCount(user?.id!);
    if (count) {
      setWorkoutsCount(count);
    }
  };

  const calculateAndSetPRs = async (workout: typeof activeWorkout) => {
    const workoutExercises = workout.workout_exercises ?? [];
    const totalPRs = await calculatePRs(workoutExercises);
    setPRs(totalPRs);
  };

  const saveWorkout = async (updateTemplate: boolean) => {
    if (!workoutWasUpdated) return;
    try {
      //positively update
      setWorkoutsCount((prev) => prev + 1);

      await finishWorkout({
        activeWorkout: workout,
        initialActiveWorkout,
        isNewWorkout,
        updateTemplate,
        formattedTime,
        caloriesBurned,
        PRs,
        user: user!,
      });

      // Cleanup and state reset
      setRefetchWorkouts();
      resetTimer();
      endTimer();
      resetActiveWorkout();
      setPersistedStorage(false);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error finishing workout:", error);
      //if failed undo positive update
      setWorkoutsCount((prev) => prev - 1);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomImage
        customStyle={{ borderRadius: "50%" }}
        imageUrl={TrophyImage}
        height={200}
        width={200}
      />
      <Text style={styles.title}>Congratulations!</Text>
      <Text style={styles.subtitle}>
        You completed your {getOrdinalSuffix(workoutsCount)} workout!
      </Text>
      {caloriesBurned > 0 && (
        <Text style={styles.calories}>
          Estimated Calories Burned: {caloriesBurned} kcal
        </Text>
      )}
      <WorkoutSummary workout={workout} PRs={PRs} />
    </SafeAreaView>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontWeight: "bold",
      fontSize: 32,
      marginVertical: 10,
      color: theme.textColor,
    },
    subtitle: {
      fontSize: 22,
      marginVertical: 10,
      color: theme.textColor,
    },
    calories: {
      fontSize: 18,
      color: theme.green,
      fontWeight: "bold",
      marginBottom: 10,
    },
  });
