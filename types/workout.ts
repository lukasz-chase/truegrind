import { WorkoutExercisePopulated } from "./workoutExercise";

export type Workout = {
  id: string;
  name: string;
  user_id: string;
  notes?: string;
  split_id: string;
  workout_exercises?: WorkoutExercisePopulated[];
  created_at?: string;
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
