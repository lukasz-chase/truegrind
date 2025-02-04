import { UserProfile } from "@/types/user";
import { supabase } from "./supabase";
import userStore from "@/store/userStore";

export const setProfileInUserStore = async (userId: string) => {
  try {
    const { data, error, status } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error && status !== 406) {
      throw error;
    }
    if (data) {
      userStore.setState({ user: data });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const updateUserProfile = async (
  userId: string,
  propertiesToUpdate: Partial<UserProfile>
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(propertiesToUpdate)
    .eq("id", userId)
    .select("*")
    .returns<UserProfile[]>();
  if (data) {
    userStore.setState({ user: data[0] });
  }
  if (error) {
    console.log("error", error);
  }
};
