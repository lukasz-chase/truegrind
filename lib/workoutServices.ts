import { Workout } from "@/types/workout";
import { supabase } from "./supabase";
import { areObjectsDifferent } from "@/utils/helpers";
import { getStartOfWeek } from "@/utils/calendar";

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
  const { error } = await supabase
    .from("workout_history")
    .insert(workoutHistory);
  console.log("error creating workout history", error);
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
    const { error } = await supabase
      .from("workouts")
      .upsert(workoutDB)
      .eq("id", activeWorkout.id);
    console.log("error updating workout", error);
  }
};
export const updateWorkoutsBulk = async (workoutsToUpdate: Workout[]) => {
  try {
    const workoutsToUpdateNotPopulated = workoutsToUpdate.map((workout) => {
      const { workout_exercises, ...workoutNotPopulated } = workout;
      return workoutNotPopulated;
    });

    const { error } = await supabase
      .from("workouts")
      .upsert(workoutsToUpdateNotPopulated);
    if (error) console.error("Supabase error:", error);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};
export const deleteWorkout = async (workoutId: string) => {
  await supabase.from("workouts").delete().eq("id", workoutId);
};

export const fetchWorkoutsCount = async (userId: string) => {
  const { count, error } = await supabase
    .from("workout_history")
    .select("*", { count: "estimated", head: true })
    .eq("user_id", userId);
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
    return data as Workout[];
  }
  if (error) console.log(error);
};

export const copyWorkout = async (
  workout: Workout,
  userId: string,
  folderId?: string
) => {
  try {
    const { getInitialFolderId } = await import("./folderService");
    const workoutExercisesToCreate: any[] = [];
    const { id, workout_exercises, created_at, ...rest } = workout;
    let folderToCopyTo = folderId;
    if (!folderId) {
      folderToCopyTo = await getInitialFolderId(userId, workout.split_id);
    }
    const { data, error } = await supabase
      .from("workouts")
      .insert({ ...rest, user_id: userId, folder_id: folderToCopyTo })
      .select("*")
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
    const { data: exercises, error: errorExercises } = await supabase
      .from("workout_exercises")
      .insert(workoutExercisesToCreate)
      .select("*, exercises(*), exercise_sets(*)");
    if (data && exercises) {
      return { ...data, workout_exercises: exercises } as Workout;
    }
    if (errorExercises) console.log({ errorExercises });
    if (error) console.log({ error });
  } catch (error) {
    console.log(error);
  }
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

export const fetchWeeklyWorkoutCount = async (userId: string) => {
  const startOfWeek = getStartOfWeek(new Date()).toISOString();

  const { count, error } = await supabase
    .from("workout_history")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", userId)
    .gte("created_at", startOfWeek);

  if (error) {
    console.error("Error fetching weekly workout count", error);
    return 0;
  }
  return count || 0;
};
