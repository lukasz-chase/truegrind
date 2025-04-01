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
  bar_type: BarTypeEnum | null;
};
export type SetHistoryProps = {
  reps: number;
  weight: number;
  rpe: number | null;
  partials: number | null;
  is_warmup: boolean;
  is_dropset: boolean;
  user_id: string | null;
  bar_type: BarTypeEnum | null;
};

export enum BarTypeEnum {
  WOMEN_OLYMPIC_BAR = "Women Olympic Bar",
  MEN_OLYMPIC_BAR = "Men Olympic Bar",
  EZ_CURL_BAR = "Ez Curl Bar",
  TRICEPS_BAR = "Triceps Bar",
  TRAP_BAR = "Trap Bar",
  SQUAT_SAFETY_BAR = "Squat Safety Bar",
}
