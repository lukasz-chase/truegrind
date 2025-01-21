import { UserProfile } from "@/types/user";
import { supabase } from "./supabase";
import userStore from "@/store/userStore";

export const updateUserProfile = async (
  customTimers: number[],
  userId: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ custom_timers: customTimers })
    .eq("id", userId)
    .returns<UserProfile>();
  if (data) {
    userStore.setState({ user: data });
  }
  if (error) {
    console.log("error", error);
  }
};
export const upsertUserProfile = async (updates: any) => {
  const { error } = await supabase.from("profiles").upsert(updates);

  if (error) {
    console.log(error);
  }
};
