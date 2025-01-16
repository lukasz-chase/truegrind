import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://rwvwylunnscchrxmlnhf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dnd5bHVubnNjY2hyeG1sbmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNDU5NDAsImV4cCI6MjA0NjkyMTk0MH0.dkuiZKkKepYI_I--bCfZD2Da4UPSseNcTXlO6Dy12Tw",
  {
    auth: {
      storage: {
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
  }
);
