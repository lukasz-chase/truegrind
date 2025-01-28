import { Workout } from "@/types/workout";
import { areObjectsDifferent } from "./helpers";
import { supabase } from "./supabase";

export const updateWorkout = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutHistoryId: string,
  isNewWorkout: boolean
) => {
  if (
    areObjectsDifferent(activeWorkout, initialActiveWorkout) ||
    isNewWorkout
  ) {
    const { workout_exercises, ...workoutDB } = activeWorkout;
    await supabase
      .from("workouts")
      .upsert(workoutDB)
      .eq("id", activeWorkout.id)
      .select();
  }
  const { workout_exercises, id, ...workoutNotPopulated } = activeWorkout;
  const workoutHistory = {
    ...workoutNotPopulated,
    id: workoutHistoryId,
    created_at: new Date().toISOString(),
  };
  await supabase.from("workout_history").insert(workoutHistory);
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
