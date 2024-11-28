import { Workout } from "@/types/workout";
import { supabase } from "./supabase";
import { WorkoutExercise } from "@/types/workoutExercise";
import { ExerciseSet } from "@/types/exercisesSets";
import userStore from "@/store/userStore";
import { UserProfile } from "@/types/user";
import uuid from "react-native-uuid";

export const updateWorkout = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutHistoryId: string
) => {
  if (
    initialActiveWorkout.name !== activeWorkout.name ||
    initialActiveWorkout.notes !== activeWorkout.notes
  ) {
    await supabase
      .from("workouts")
      .update({ name: activeWorkout.name, notes: activeWorkout.notes })
      .eq("id", activeWorkout.id)
      .select();
  }
  const { workout_exercises, id, ...workoutNotPopulated } = activeWorkout;
  const workoutHistory = { ...workoutNotPopulated, id: workoutHistoryId };
  await supabase.from("workout_history").insert(workoutHistory);
};

export const updateWorkoutExercises = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutHistoryId: string,
  workoutExercisesHistoryIds: { id: string; historyId: string }[]
) => {
  const workoutExercisesToUpdate: WorkoutExercise[] = [];
  const workoutExercisesHistoryToCreate: WorkoutExercise[] = [];
  const workoutExercisesToDelete: string[] = [];

  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    const initialExercise = initialActiveWorkout.workout_exercises?.find(
      (ex) => ex.id === workoutExercise.id
    );
    const { exercise_sets, exercises, ...workoutExerciseNotPopulated } =
      workoutExercise;
    workoutExercisesHistoryToCreate.push({
      ...workoutExerciseNotPopulated,
      id: workoutExercisesHistoryIds.find((e) => e.id === workoutExercise.id)!
        .historyId,
      exercise_id: workoutExercise.exercises.id,
      workout_id: workoutHistoryId,
    });

    if (
      !initialExercise ||
      workoutExercise.notes !== initialExercise.notes ||
      workoutExercise.timer !== initialExercise.timer
    ) {
      workoutExercisesToUpdate.push({
        ...workoutExerciseNotPopulated,
        exercise_id: workoutExercise.exercises.id,
        workout_id: activeWorkout.id,
      });
    }
  }

  for (const initialWorkoutExercise of initialActiveWorkout.workout_exercises ||
    []) {
    const exists = activeWorkout.workout_exercises?.some(
      (current) => current.id === initialWorkoutExercise.id
    );
    if (!exists) workoutExercisesToDelete.push(initialWorkoutExercise.id);
  }

  if (workoutExercisesToUpdate.length > 0) {
    await supabase.from("workout_exercises").upsert(workoutExercisesToUpdate);
  }
  if (workoutExercisesToDelete.length > 0) {
    await supabase
      .from("workout_exercises")
      .delete()
      .in("id", workoutExercisesToDelete);
  }
  await supabase
    .from("exercises_history")
    .insert(workoutExercisesHistoryToCreate);
};

export const updateExerciseSets = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutExercisesHistoryIds: { id: string; historyId: string }[]
) => {
  const exerciseSetsToUpdate: ExerciseSet[] = [];
  const exerciseHistorySets: ExerciseSet[] = [];
  const exerciseSetsToDelete: string[] = [];
  const userId = userStore.getState().user?.id;
  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    let order = 1;
    for (const set of workoutExercise.exercise_sets || []) {
      if (set.completed) {
        const setUpdated = {
          ...set,
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

export const updateUserProfile = async (
  customTimers: number[],
  userId: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ custom_timers: customTimers })
    .eq("id", userId)
    .returns<UserProfile>();
  if (data) {
    userStore.setState({ user: data });
  }
  if (error) {
    console.log("error", error);
  }
};
