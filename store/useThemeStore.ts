import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Appearance } from "react-native";
import { DarkTheme, LightTheme } from "@/constants/colors";
import { AppTheme, AppThemeEnum } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeState = {
  mode: AppTheme;
  theme: typeof LightTheme;
  changeTheme: (theme: AppTheme) => void;
};

export default create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: (Appearance.getColorScheme() as AppTheme) || "light",
      get theme() {
        return get().mode === AppThemeEnum.LIGHT ? LightTheme : DarkTheme;
      },
      changeTheme: (theme) => {
        set({
          mode: theme,
          theme: theme === AppThemeEnum.LIGHT ? LightTheme : DarkTheme,
        });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
