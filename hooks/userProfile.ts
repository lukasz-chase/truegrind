import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";

export const getProfile = async (userId: string) => {
  try {
    const { data, error, status } = await supabase
      .from("profiles")
      .select()
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
