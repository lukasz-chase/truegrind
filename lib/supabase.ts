import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage:
      Platform.OS !== "web" || typeof window !== "undefined"
        ? AsyncStorage
        : {
            getItem: async (key) => {
              const value = await AsyncStorage.getItem(key);
              return value;
            },
            setItem: async (key, value) => {
              await AsyncStorage.setItem(key, value);
            },
            removeItem: async (key) => {
              await AsyncStorage.removeItem(key);
            },
          },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
