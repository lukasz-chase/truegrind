import { WorkoutExercisePopulated } from "./workoutExercise";

export type Workout = {
  id: string;
  name: string;
  user_id: string;
  notes?: string;
  split_id: string;
  workout_exercises?: WorkoutExercisePopulated[];
  created_at?: string;
  order: number | null;
  folder_id: string | null;
};

export type WorkoutHistory = {
  id: string;
  name: string;
  user_id: string;
  notes?: string;
  split_id: string;
  workout_exercises?: WorkoutExercisePopulated[];
  created_at?: string;
  workout_time?: string;
};
