import { Pressable, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import Octicons from "@expo/vector-icons/Octicons";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { AppThemeEnum, ThemeColors } from "@/types/user";

type CompleteSetButtonProps = {
  completeSet: () => void;
  completed: boolean;
  reps: number | null;
  disabled: boolean;
};

const CompleteSetButton = ({
  completeSet,
  completed,
  reps,
  disabled,
}: CompleteSetButtonProps) => {
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: completed
            ? theme.green
            : mode === AppThemeEnum.DARK
            ? theme.black
            : theme.gray,
          opacity: !reps ? 0.3 : 1,
        },
      ]}
      disabled={!reps || disabled}
      onPress={completeSet}
    >
      {disabled ? (
        <Octicons name="dash" size={24} color={theme.textColor} />
      ) : (
        <AntDesign
          name="check"
          size={20}
          color={completed ? theme.white : theme.textColor}
        />
      )}
    </Pressable>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      height: 30,
      width: 40,
    },
  });

export default CompleteSetButton;
