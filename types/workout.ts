import { Exercise } from "./exercises";
import { ExerciseSet } from "./exercisesSets";

export type Workout = {
  id: string;
  name: string;
  user_id: string;
  notes?: string;
  workout_exercises?: {
    id: number;
    exercises: Exercise;
    exercise_sets: ExerciseSet[];
  }[];
};
