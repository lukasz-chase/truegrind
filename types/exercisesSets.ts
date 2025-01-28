export type ExerciseSet = {
  id: string;
  workout_exercise_id: string;
  order: number;
  reps: number | null;
  weight: number | null;
  is_warmup: boolean;
  is_dropset: boolean;
  rpe: number | null;
  completed: boolean;
  partials: number | null;
  user_id: string | null;
};
export type SetHistoryProps = {
  reps: number;
  weight: number;
  rpe: number | null;
  partials: number | null;
  is_warmup: boolean;
  is_dropset: boolean;
  user_id: string | null;
};
