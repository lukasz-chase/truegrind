import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  dragItemId: string | null;
  children: any;
};
const WorkoutExerciseWrapper = ({ dragItemId, children }: Props) => {
  const [isDragged, setIsDragged] = useState(!!dragItemId);
  useEffect(() => {
    setIsDragged(!!dragItemId);
  }, [dragItemId]);
  return (
    <View style={[styles.workoutWrapper, isDragged && styles.collapsed]}>
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  workoutWrapper: {
    flexDirection: "row",
    gap: 6,
    paddingLeft: 6,
    paddingBottom: 6,
  },
  collapsed: {
    height: 0,
    overflow: "hidden",
    opacity: 0,
  },
});
export default WorkoutExerciseWrapper;
