import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Appearance } from "react-native";
import { DARK_THEME, LIGHT_THEME } from "@/constants/colors";
import { AppTheme, AppThemeEnum } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeState = {
  mode: AppTheme;
  theme: typeof LIGHT_THEME;
  changeTheme: (theme: AppTheme) => void;
};

export default create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: (Appearance.getColorScheme() as AppTheme) || "light",
      get theme() {
        return get().mode === AppThemeEnum.LIGHT ? LIGHT_THEME : DARK_THEME;
      },
      changeTheme: (theme) => {
        set({
          mode: theme,
          theme: theme === AppThemeEnum.LIGHT ? LIGHT_THEME : DARK_THEME,
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
