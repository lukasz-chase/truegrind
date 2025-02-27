import { Workout } from "./workout";

export enum WorkoutCalendarStatusEnum {
  Scheduled = "scheduled",
  Completed = "completed",
  Missed = "missed",
}

export type WorkoutCalendarStatus = `${WorkoutCalendarStatusEnum}`;

export type WorkoutCalendarPopulated = {
  id: string;
  user_id: string;
  workout_id: string;
  scheduled_date: string;
  status: WorkoutCalendarStatusEnum;
  workouts: Workout;
  color: string;
  start_time: Date;
  end_time: Date;
  calendar_event_id?: string;
  workout_history_id?: string | null;
  workout_history?: { name: string };
};
export type WorkoutCalendar = {
  id: string;
  user_id: string;
  workout_id: string;
  scheduled_date: string;
  status: WorkoutCalendarStatusEnum;
  color: string;
  start_time: Date;
  end_time: Date;
  calendar_event_id?: string;
  workout_history_id?: string | null;
};
