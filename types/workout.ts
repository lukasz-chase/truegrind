import { Exercise } from "./exercises";
import { ExerciseSet } from "./exercisesSets";

export type Workout = {
  id: number;
  name: string;
  user_id: string;
  workout_exercises: {
    id: number;
    exercises: Exercise;
    exercise_sets: ExerciseSet[];
  }[];
};
