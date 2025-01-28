import { Exercise } from "./exercises";
import { ExerciseSet } from "./exercisesSets";

export type WorkoutExercise = {
  id: string;
  note: { noteValue: string; showNote: boolean };
  timer: number | null;
  warmup_timer: number | null;
  exercise_id: string;
  workout_id: string;
  created_at: string;
  superset: string | null;
  user_id: string | null;
};

export type WorkoutExercisePopulated = {
  id: string;
  note: { noteValue: string; showNote: boolean };
  timer: number | null;
  warmup_timer: number | null;
  order: number;
  exercises: Exercise;
  exercise_sets: ExerciseSet[];
  superset: string | null;
  user_id: string | null;
  created_at?: string;
};
