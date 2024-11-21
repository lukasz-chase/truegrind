import { WorkoutExercisePopulated } from "./workoutExercise";

export type Workout = {
  id: string;
  name: string;
  user_id: string;
  notes?: string;
  workout_exercises?: WorkoutExercisePopulated[];
};
