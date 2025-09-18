import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// A simple in-memory storage for server-side or build-time rendering.
// It does nothing, which is fine because we don't need to persist sessions
// during the static export.
const serverStorage = {
  setItem: (_key: string, _value: string) => {
    // no-op
  },
  getItem: (_key: string) => {
    return null;
  },
  removeItem: (_key: string) => {
    // no-op
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window === "undefined" ? serverStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
