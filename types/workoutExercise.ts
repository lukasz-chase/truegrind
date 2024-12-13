import { Exercise } from "./exercises";
import { ExerciseSet } from "./exercisesSets";

export type WorkoutExercise = {
  id: string;
  notes: string;
  timer: number | null;
  warmup_timer: number | null;
  exercise_id: string;
  workout_id: string;
  created_at: string;
};

export type WorkoutExercisePopulated = {
  id: string;
  notes: string;
  timer: number | null;
  warmup_timer: number | null;
  order: number;
  exercises: Exercise;
  exercise_sets: ExerciseSet[];
};
