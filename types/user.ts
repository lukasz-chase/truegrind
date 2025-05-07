import { BodyPartLabel } from "./measurements";

export type CurrentGoal = {
  name: BodyPartLabel;
  value: number;
  unit: string;
};

export enum AppThemeEnum {
  LIGHT = "light",
  DARK = "dark",
}

export type UserProfile = {
  username: string;
  id: string;
  custom_timers: number[];
  active_split_id: string | null;
  current_goal: CurrentGoal | null;
  profile_picture: string | null;
  age: number | null;
  height: number | null;
  theme: AppThemeEnum;
};
