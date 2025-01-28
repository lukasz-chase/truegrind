import userStore from "@/store/userStore";
import { ExerciseSet, SetHistoryProps } from "@/types/exercisesSets";
import { Workout } from "@/types/workout";
import { supabase } from "./supabase";
import uuid from "react-native-uuid";

export const updateExerciseSets = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutExercisesHistoryIds: { id: string; historyId: string }[]
) => {
  const exerciseSetsToUpdate: ExerciseSet[] = [];
  const exerciseHistorySets: ExerciseSet[] = [];
  const exerciseSetsToDelete: string[] = [];
  let userId = null;
  const user = userStore.getState().user;
  if (user?.id) {
    userId = user.id;
  }
  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    let order = 1;
    for (const set of workoutExercise.exercise_sets || []) {
      if (set.completed) {
        const setUpdated = {
          ...set,
          created_at: new Date().toISOString(),
          completed: false,
          order: order++,
          workout_exercise_id: workoutExercise.id,
        };
        exerciseSetsToUpdate.push(setUpdated);

        const workoutExerciseHistoricId = workoutExercisesHistoryIds.find(
          (e) => e.id === workoutExercise.id
        )!.historyId;
        const historySet = {
          ...setUpdated,
          id: uuid.v4(),
          workout_exercise_id: workoutExerciseHistoricId,
          exercise_id: workoutExercise.exercises.id,
          user_id: userId,
        };
        exerciseHistorySets.push(historySet);
      }
    }
  }

  for (const initialWorkoutExercise of initialActiveWorkout.workout_exercises ||
    []) {
    for (const initialSet of initialWorkoutExercise.exercise_sets || []) {
      const exists = activeWorkout.workout_exercises?.some(
        (currentWorkoutExercise) =>
          currentWorkoutExercise.exercise_sets.some(
            (currentSet) => currentSet.id === initialSet.id
          )
      );
      if (!exists) exerciseSetsToDelete.push(initialSet.id);
    }
  }

  if (exerciseSetsToUpdate.length > 0) {
    await supabase.from("exercise_sets").upsert(exerciseSetsToUpdate);
    await supabase.from("sets_history").upsert(exerciseHistorySets);
  }
  if (exerciseSetsToDelete.length > 0) {
    await supabase
      .from("exercise_sets")
      .delete()
      .in("id", exerciseSetsToDelete);
  }
};

export const fetchHighestWeightSet = async (
  exerciseId: string,
  highestWeight: number
) => {
  const { data, error } = await supabase
    .from("sets_history")
    .select("id, weight")
    .eq("exercise_id", exerciseId)
    .gte("weight", highestWeight);
  return { data, error };
};

export const fetchSetsHistory = async (
  exerciseId: string,
  userId: string,
  setOrder: number
) => {
  const { data, error } = await supabase
    .from("sets_history")
    .select(`reps, weight, rpe, partials, is_warmup, is_dropset`)
    .eq("exercise_id", exerciseId)
    .eq("user_id", userId)
    .eq('"order"', setOrder)
    .order("created_at", { ascending: false })
    .limit(1)
    .single<SetHistoryProps>();
  return { data, error };
};
