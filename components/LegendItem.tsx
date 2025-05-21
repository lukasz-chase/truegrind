import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  workoutName: string;
  color: string;
};

export default function LegendItem({ workoutName, color }: Props) {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={[styles.legendItem, { backgroundColor: color }]}>
      <Text style={styles.legendItemText}>{workoutName}</Text>
    </View>
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
