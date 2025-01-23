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
