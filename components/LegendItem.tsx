import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { Text, StyleSheet, Pressable } from "react-native";

type Props = {
  workoutName: string;
  color: string;
  onPress: () => void;
  isActive: boolean;
  isFiltered: boolean;
};

export default function LegendItem({
  workoutName,
  color,
  onPress,
  isActive,
  isFiltered,
}: Props) {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <Pressable
      style={[
        styles.legendItem,
        { backgroundColor: color, opacity: isFiltered && !isActive ? 0.5 : 1 },
      ]}
      onPress={onPress}
    >
      <Text style={styles.legendItemText}>{workoutName}</Text>
    </Pressable>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderRadius: 10,
      height: 40,
    },
    legendItemText: {
      color: theme.white,
      fontSize: 18,
      fontWeight: "bold",
    },
  });
