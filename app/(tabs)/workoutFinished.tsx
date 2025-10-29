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
import {
  createWorkoutHistory,
  fetchWorkoutsCount,
  updateWorkout,
} from "@/lib/workoutServices";
import {
  createWorkoutExercisesHistory,
  updateWorkoutExercises,
} from "@/lib/workoutExerciseServices";
import {
  createExerciseSetsHistory,
  updateExerciseSets,
} from "@/lib/exerciseSetsService";
import {
  fetchUserWorkoutCalendar,
  upsertWorkoutCalendar,
} from "@/lib/workoutCalendarService";
import { WorkoutCalendarStatusEnum } from "@/types/workoutCalendar";
import { saveTemplate, UPDATE_TEMPLATE } from "@/constants/actionModal";
import useActionModal from "@/store/useActionModal";
import userStore from "@/store/userStore";
import { generateNewColor } from "@/utils/colors";
import { getCalendarDateFormat, getOrdinalSuffix } from "@/utils/calendar";
import { ThemeColors } from "@/types/user";
import useThemeStore from "@/store/useThemeStore";
import { supabase } from "@/lib/supabase";
import { useShallow } from "zustand/shallow";

const TrophyImage = require("@/assets/images/trophy.webp");

export default function WorkoutFinishedScreen() {
  const [workoutsCount, setWorkoutsCount] = useState(0);

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
  const saveWorkout = async (updateTemplate: boolean) => {
    if (!workoutWasUpdated) return;
    try {
      const workoutHistoryId = uuid.v4();
      await updateWorkout(
        activeWorkout,
        initialActiveWorkout,
        isNewWorkout,
        updateTemplate
      );
      await createWorkoutHistory(
        activeWorkout,
        workoutHistoryId,
        formattedTime
      );
      const workoutExercisesHistoryIds =
        activeWorkout.workout_exercises?.map((workoutExercise) => ({
          historyId: uuid.v4(),
          id: workoutExercise.id,
        })) ?? [];
      await updateWorkoutExercises(
        activeWorkout,
        initialActiveWorkout,
        updateTemplate
      );
      await createWorkoutExercisesHistory(
        activeWorkout,
        workoutHistoryId,
        workoutExercisesHistoryIds
      );
      await updateExerciseSets(activeWorkout, initialActiveWorkout);
      await createExerciseSetsHistory(
        activeWorkout,
        workoutExercisesHistoryIds
      );
      const userCalendarWorkouts = await fetchUserWorkoutCalendar(
        activeWorkout.user_id,
        new Date().getMonth() + 1
      );
      const currentColors = userCalendarWorkouts.map((data) => data.color);
      const workoutCalendar = userCalendarWorkouts.find((workout) => {
        return workout.workout_id === activeWorkout.id;
      });
      const color = workoutCalendar
        ? workoutCalendar.color
        : generateNewColor(currentColors);
      const [minutes, seconds] = formattedTime.split(":").map(Number);
      const now = new Date();
      const startTime = new Date(
        now.getTime() - (minutes * 60 + seconds) * 1000
      );
      await upsertWorkoutCalendar({
        status: WorkoutCalendarStatusEnum.Completed,
        user_id: activeWorkout.user_id,
        scheduled_date: getCalendarDateFormat(),
        workout_id: activeWorkout.id,
        color,
        start_time: startTime,
        end_time: now,
        workout_history_id: workoutHistoryId,
      });

      setRefetchWorkouts();
      resetTimer();
      endTimer();
      resetActiveWorkout();
      setPersistedStorage(false);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      const { data: stravaIntegration, error: checkError } = await supabase
        .from("strava_integrations")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (checkError || !stravaIntegration) {
        console.log("No Strava integration found for user. Skipping upload.");
        return;
      }
      await supabase.functions.invoke("strava-upload", {
        body: { userId: user!.id, workout, startTime },
      });
    } catch (error) {
      console.error("Error finishing workout:", error);
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
      <WorkoutSummary workout={workout} />
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
  });
