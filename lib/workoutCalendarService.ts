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
      .select("*, workout_history(name)")
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

export const fetchUserWorkoutCalendar = async (
  userId: string,
  month: number
) => {
  const today = new Date();
  const year = today.getFullYear();

  const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0); // Corrected month offset
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month
  const { data, error } = await supabase
    .from("workout_calendar")
    .select("*, workout_history(name), workouts(name)")
    .eq("user_id", userId)
    .gte("scheduled_date", startOfMonth.toISOString())
    .lte("scheduled_date", endOfMonth.toISOString())
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

export const deleteWorkoutCalendar = async (
  workoutId: string,
  scheduledDate: string,
  userId: string
) => {
  const { error } = await supabase
    .from("workout_calendar")
    .delete()
    .eq("workout_id", workoutId)
    .eq("user_id", userId)
    .eq("scheduled_date", scheduledDate);
  if (error) {
    console.error("Error removing workout from calendar", error);
    return;
  }
};
