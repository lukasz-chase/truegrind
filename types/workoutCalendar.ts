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
};
export type WorkoutCalendar = {
  id: string;
  user_id: string;
  workout_id: string;
  scheduled_date: string;
  status: WorkoutCalendarStatusEnum;
  color: string;
};
