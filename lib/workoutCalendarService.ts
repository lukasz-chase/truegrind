import { getCalendarDateFormat } from "./helpers";
import { supabase } from "./supabase";
import {
  WorkoutCalendar,
  WorkoutCalendarPopulated,
  WorkoutCalendarStatusEnum,
} from "@/types/workoutCalendar";

export const upsertWorkoutCalendar = async (
  workoutCalendar: Partial<WorkoutCalendar>
) => {
  try {
    const previousWorkoutForThisDate = await fetchUserWorkoutCalendarByDate(
      workoutCalendar.user_id!,
      workoutCalendar.scheduled_date!
    );
    const workoutCalendarData = previousWorkoutForThisDate
      ? { ...previousWorkoutForThisDate, ...workoutCalendar }
      : workoutCalendar;
    const { data, error } = await supabase
      .from("workout_calendar")
      .upsert(workoutCalendarData)
      .select("*, workouts(name)")
      .returns<WorkoutCalendarPopulated>()
      .limit(1)
      .single();
    if (error) {
      console.error("Error creating workout calendar", error);
      return;
    }

    return data;
  } catch (error) {
    console.error("Error creating workout calendar", error);
    return;
  }
};

export const fetchUserWorkoutCalendarByDate = async (
  userId: string,
  date: string
) => {
  const { data, error } = await supabase
    .from("workout_calendar")
    .select("*")
    .eq("user_id", userId)
    .eq("scheduled_date", date)
    .returns<WorkoutCalendar>()
    .limit(1)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching workout calendar", error);
    }
    return;
  }

  return data as WorkoutCalendar;
};

export const fetchUserWorkoutCalendar = async (userId: string) => {
  const today = new Date();

  const startOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const endOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    0,
    23,
    59,
    59,
    999
  );

  const { data, error } = await supabase
    .from("workout_calendar")
    .select("*, workouts(name)")
    .eq("user_id", userId)
    .gte("scheduled_date", startOfCurrentMonth.toISOString())
    .lte("scheduled_date", endOfNextMonth.toISOString())
    .returns<WorkoutCalendarPopulated[]>();

  if (error) {
    console.error("Error fetching workout calendar", error);
    return [];
  }

  return data || [];
};

export const updateMissedWorkouts = async (userId: string) => {
  const { data, error } = await supabase
    .from("workout_calendar")
    .update({ status: WorkoutCalendarStatusEnum.Missed })
    .eq("user_id", userId)
    .lt("scheduled_date", getCalendarDateFormat())
    .eq("status", WorkoutCalendarStatusEnum.Scheduled)
    .select("id")
    .returns<WorkoutCalendarPopulated[]>();

  if (error) {
    console.error("Error updating workout calendar", error);
    return;
  }

  return data;
};
