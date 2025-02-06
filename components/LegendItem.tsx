import { View, Text, StyleSheet } from "react-native";

type Props = {
  workoutName: string;
  color: string;
};

export default function LegendItem({ workoutName, color }: Props) {
  return (
    <View style={[styles.legendItem, { backgroundColor: color }]}>
      <Text style={styles.legendItemText}>{workoutName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    height: 40,
  },
  legendItemText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
