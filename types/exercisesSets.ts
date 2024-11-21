export type ExerciseSet = {
  id: string;
  workout_exercise_id: string;
  order: number;
  reps: number | null;
  weight: number | null;
  is_warmup: boolean;
  is_dropset: boolean;
  reps_in_reserve: number | null;
  completed: boolean;
};
