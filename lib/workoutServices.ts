import { Workout } from "@/types/workout";
import { areObjectsDifferent } from "./helpers";
import { supabase } from "./supabase";

export const createWorkoutHistory = async (
  workout: Workout,
  workoutHistoryId: string,
  workoutTime: string
) => {
  const { workout_exercises, id, ...workoutNotPopulated } = workout;
  const workoutHistory = {
    ...workoutNotPopulated,
    id: workoutHistoryId,
    created_at: new Date().toISOString(),
    workout_time: workoutTime,
  };
  await supabase.from("workout_history").insert(workoutHistory);
};

export const updateWorkout = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  isNewWorkout: boolean,
  updateTemplate: boolean
) => {
  if (
    (areObjectsDifferent(activeWorkout, initialActiveWorkout) ||
      isNewWorkout) &&
    updateTemplate
  ) {
    const { workout_exercises, ...workoutDB } = activeWorkout;
    await supabase
      .from("workouts")
      .upsert(workoutDB)
      .eq("id", activeWorkout.id);
  }
};
export const deleteWorkout = async (workoutId: string) => {
  await supabase.from("workouts").delete().eq("id", workoutId);
};

export const fetchWorkoutsCount = async () => {
  const { count, error } = await supabase
    .from("workout_history")
    .select("*", { count: "estimated", head: true });
  if (count) {
    return count;
  }
  if (error) console.log(error);
};
export const fetchExampleWorkouts = async (splitId: string) => {
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_exercises(*, exercises(*), exercise_sets(*))")
    .eq("split_id", splitId)
    .is("user_id", null);
  if (data) {
    return data;
  }
  if (error) console.log(error);
};

export const copyWorkout = async (workout: Workout, userId: string) => {
  const workoutExercisesToCreate: any[] = [];
  const { id, workout_exercises, created_at, ...rest } = workout;
  const { data, error } = await supabase
    .from("workouts")
    .insert({ ...rest, user_id: userId })
    .select("id")
    .limit(1)
    .single();
  workout_exercises?.forEach((workoutExercise) => {
    const { id, exercise_sets, exercises, created_at, ...rest } =
      workoutExercise;
    workoutExercisesToCreate.push({
      ...rest,
      user_id: userId,
      workout_id: data?.id,
    });
  });
  await supabase.from("workout_exercises").insert(workoutExercisesToCreate);
  if (data) {
    return data;
  }
  if (error) console.log(error);
};
export const fetchWorkoutHistory = async (
  workoutHistoryId: string,
  userId: string
) => {
  const { data, error } = await supabase
    .from("workout_history")
    .select(
      `
      *,
      workout_exercises:exercises_history(
        *,
        exercises(*),
        exercise_sets:sets_history(*)
      )
    `
    )
    .eq("id", workoutHistoryId)
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (data) {
    return data;
  }
  if (error) console.log(error);
};

export const fetchWorkout = async (id: string, userId: string) => {
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_exercises(*, exercises(*), exercise_sets(*))")
    .eq("id", id)
    .eq("user_id", userId)
    .limit(1)
    .single();
  if (error) console.log(error);
  if (data) {
    return data;
  } else {
    return null;
  }
};
