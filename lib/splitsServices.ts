import { Split, SplitPopulated } from "@/types/split";
import { supabase } from "./supabase";
import { createFolder } from "./folderService";

export const fetchUserSplitWithWorkouts = async (
  userId: string,
  splitId: string
) => {
  const { data, error } = await supabase
    .from("splits")
    .select(
      `*, workouts(*, workout_exercises(*, exercises(*), exercise_sets(*)))`
    )
    .eq("id", splitId)
    .eq("workouts.user_id", userId)
    .returns<SplitPopulated>()
    .limit(1)
    .single();
  if (data) {
    return data;
  }
  if (error) {
    console.log(error);
  }
};

export const fetchSplits = async (userId: string) => {
  const { data, error } = await supabase
    .from("splits")
    .select(`*`)
    .or(`user_id.eq.${userId},user_id.is.null`)
    .returns<Split[]>();
  if (data) {
    return data;
  }
  if (error) {
    console.log(error);
  }
};

export const createSplit = async (split: Partial<Split>) => {
  const { data, error } = await supabase
    .from("splits")
    .insert(split)
    .select("*")
    .returns<Split[]>();
  if (error) console.log(error);
  if (data) {
    await createFolder({
      name: "Uncollected",
      split_id: data[0].id,
      user_id: split.user_id,
    });
    return data[0];
  }
};

export const deleteSplit = async (splitId: string) => {
  await supabase.from("splits").delete().eq("id", splitId);
};
