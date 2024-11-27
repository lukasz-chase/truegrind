import { Workout } from "@/types/workout";
import { supabase } from "./supabase";
import { WorkoutExercise } from "@/types/workoutExercise";
import { ExerciseSet } from "@/types/exercisesSets";
import userStore from "@/store/userStore";
import { UserProfile } from "@/types/user";

export const updateWorkout = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout
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
};

export const updateWorkoutExercises = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout
) => {
  const workoutExercisesToUpdate: WorkoutExercise[] = [];
  const workoutExercisesToDelete: string[] = [];

  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    const initialExercise = initialActiveWorkout.workout_exercises?.find(
      (ex) => ex.id === workoutExercise.id
    );

    if (
      !initialExercise ||
      workoutExercise.notes !== initialExercise.notes ||
      workoutExercise.timer !== initialExercise.timer
    ) {
      const { exercise_sets, exercises, ...rest } = workoutExercise;
      workoutExercisesToUpdate.push({
        ...rest,
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
};

export const updateExerciseSets = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout
) => {
  const exerciseSetsToUpdate: ExerciseSet[] = [];
  const exerciseSetsToDelete: string[] = [];

  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    let order = 1;
    for (const set of workoutExercise.exercise_sets || []) {
      if (set.completed) {
        exerciseSetsToUpdate.push({
          ...set,
          completed: false,
          order: order++,
          workout_exercise_id: workoutExercise.id,
        });
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
    await supabase.from("sets_history").upsert(exerciseSetsToUpdate);
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
