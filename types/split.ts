import { Workout } from "./workout";

export type Split = {
  id: string;
  name: string;
  user_id: string;
};
export type SplitPopulated = {
  id: string;
  name: string;
  user_id: string;
  workouts: Workout[];
};
