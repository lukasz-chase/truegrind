import { Exercise } from "./exercises";
import { ExerciseSet } from "./exercisesSets";

export type WorkoutExercise = {
  id: string;
  notes: string;
  timer: number;
  exercise_id: string;
  workout_id: string;
};

export type WorkoutExercisePopulated = {
  id: string;
  notes: string;
  timer: number;
  order: number;
  exercises: Exercise;
  exercise_sets: ExerciseSet[];
};
