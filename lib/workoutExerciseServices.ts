import { Workout } from "@/types/workout";
import { WorkoutExercise } from "@/types/workoutExercise";
import { areObjectsDifferent } from "./helpers";
import { supabase } from "./supabase";

export const updateWorkoutExercises = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  updateTemplate: boolean
) => {
  const workoutExercisesToUpdate: WorkoutExercise[] = [];
  const workoutExercisesToDelete: string[] = [];

  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    const initialExercise = initialActiveWorkout.workout_exercises?.find(
      (ex) => ex.id === workoutExercise.id
    );
    const { exercise_sets, exercises, ...workoutExerciseNotPopulated } =
      workoutExercise;

    if (
      !initialExercise ||
      areObjectsDifferent(workoutExercise, initialExercise)
    ) {
      if ((updateTemplate && !initialExercise) || initialExercise) {
        workoutExercisesToUpdate.push({
          ...workoutExerciseNotPopulated,
          created_at: new Date().toISOString(),
          exercise_id: workoutExercise.exercises.id,
          workout_id: activeWorkout.id,
        });
      }
    }
  }

  if (updateTemplate) {
    for (const initialWorkoutExercise of initialActiveWorkout.workout_exercises ||
      []) {
      const exists = activeWorkout.workout_exercises?.some(
        (current) => current.id === initialWorkoutExercise.id
      );
      if (!exists) workoutExercisesToDelete.push(initialWorkoutExercise.id);
    }

    if (workoutExercisesToDelete.length > 0) {
      await supabase
        .from("workout_exercises")
        .delete()
        .in("id", workoutExercisesToDelete);
    }

    if (workoutExercisesToUpdate.length > 0) {
      await supabase.from("workout_exercises").upsert(workoutExercisesToUpdate);
    }
  }
};

export const createWorkoutExercisesHistory = async (
  activeWorkout: Workout,
  workoutHistoryId: string,
  workoutExercisesHistoryIds: { id: string; historyId: string }[]
) => {
  const workoutExercisesHistoryToCreate: WorkoutExercise[] = [];

  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    const { exercise_sets, exercises, ...workoutExerciseNotPopulated } =
      workoutExercise;
    workoutExercisesHistoryToCreate.push({
      ...workoutExerciseNotPopulated,
      id: workoutExercisesHistoryIds.find((e) => e.id === workoutExercise.id)!
        .historyId,
      exercise_id: workoutExercise.exercises.id,
      workout_id: workoutHistoryId,
      created_at: new Date().toISOString(),
    });
  }

  await supabase
    .from("exercises_history")
    .insert(workoutExercisesHistoryToCreate);
};
