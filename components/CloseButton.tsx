import useThemeStore from "@/store/useThemeStore";
import { AppTheme, AppThemeEnum, ThemeColors } from "@/types/user";
import { EvilIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";

const CloseButton = ({ onPress }: { onPress: () => void }) => {
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme, mode), [theme, mode]);
  return (
    <Pressable style={styles.modalCloseButton} onPress={onPress}>
      <EvilIcons name="close" size={24} color={theme.textColor} />
    </Pressable>
  );
};
const makeStyles = (theme: ThemeColors, mode: AppTheme) =>
  StyleSheet.create({
    modalCloseButton: {
      backgroundColor: mode === AppThemeEnum.DARK ? theme.black : theme.gray,
      padding: 4,
      borderRadius: 8,
    },
  });
export default CloseButton;
