import { AppColors } from "@/constants/colors";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomImage from "@/components/CustomImage";
import { supabase } from "@/lib/supabase";
import { useCallback, useState } from "react";
import { getOrdinalSuffix } from "@/lib/helpers";
import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutSummary from "@/components/WorkoutSummary";
import TemplateModal from "@/components/Modals/TemplateModal";
import { useFocusEffect } from "expo-router";
import uuid from "react-native-uuid";
import {
  updateExerciseSets,
  updateWorkout,
  updateWorkoutExercises,
} from "@/lib/supabaseActions";
import useAppStore from "@/store/useAppStore";
import useTimerStore from "@/store/useTimer";
import useWorkoutTimer from "@/store/useWorkoutTimer";

const TrophyImage = require("@/assets/images/trophy.webp");

export default function WorkoutFinishedScreen() {
  const [workoutsCount, setWorkoutsCount] = useState(0);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const {
    activeWorkout,
    initialActiveWorkout,
    workoutWasUpdated,
    isNewWorkout,
    resetActiveWorkout,
    setPersistedStorage,
  } = useActiveWorkout();
  const { refetchData } = useAppStore();
  const { endTimer } = useTimerStore();
  const { resetTimer, formattedTime } = useWorkoutTimer();
  const [workout, setWorkout] = useState({
    ...activeWorkout,
    workoutTime: formattedTime,
  });

  useFocusEffect(
    useCallback(() => {
      fetchWorkoutsCount();
      if (activeWorkout.user_id) {
        const filteredWorkout = {
          ...activeWorkout,
          workout_exercises: activeWorkout.workout_exercises?.filter(
            (workoutExercise) => workoutExercise.exercise_sets.length > 0
          ),
        };
        setWorkout({
          ...filteredWorkout,
          workoutTime: formattedTime,
        });
      }
      const exercisesChanged = haveExercisesChanged();

      if (exercisesChanged) {
        setIsTemplateModalVisible(true);
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
  const fetchWorkoutsCount = async () => {
    const { count, error } = await supabase
      .from("workout_history")
      .select("*", { count: "estimated", head: true });
    if (count) {
      setWorkoutsCount(count);
    }
  };
  const saveWorkout = async (updateTemplate: boolean) => {
    if (!workoutWasUpdated) return;
    setIsTemplateModalVisible(false);
    try {
      const workoutHistoryId = uuid.v4();
      await updateWorkout(
        activeWorkout,
        initialActiveWorkout,
        workoutHistoryId,
        isNewWorkout
      );
      const workoutExercisesHistoryIds =
        activeWorkout.workout_exercises?.map((workoutExercise) => ({
          historyId: uuid.v4(),
          id: workoutExercise.id,
        })) ?? [];
      await updateWorkoutExercises(
        activeWorkout,
        initialActiveWorkout,
        workoutHistoryId,
        workoutExercisesHistoryIds,
        updateTemplate
      );
      await updateExerciseSets(
        activeWorkout,
        initialActiveWorkout,
        workoutExercisesHistoryIds
      );
      refetchData();
      resetTimer();
      endTimer();
      resetActiveWorkout();
      setPersistedStorage(false);
    } catch (error) {
      console.error("Error finishing workout:", error);
      throw error;
    }
  };
  return (
    <>
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
      <TemplateModal
        closeModal={() => setIsTemplateModalVisible(false)}
        isVisible={isTemplateModalVisible}
        onPress={saveWorkout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 32,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 22,
    marginVertical: 10,
  },
});
