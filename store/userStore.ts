import { UserProfile } from "@/types/user";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type Store = {
  session: Session | null;
  user: UserProfile | null;
};

const userStore = create<Store>((set) => ({
  user: null,
  session: null,
}));

export default userStore;
