import { Workout } from "./workout";

export type WorkoutsFolder = {
  id: string;
  name: string;
  order: number | null;
  split_id: string;
  user_id: string;
};

export type WorkoutsFolderPopulated = {
  id: string;
  name: string;
  order: number | null;
  workouts: Workout[];
  split_id: string;
  user_id: string;
};
