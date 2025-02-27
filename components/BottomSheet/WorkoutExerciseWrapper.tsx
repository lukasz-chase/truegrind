import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

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
    <Animated.View
      style={[styles.workoutWrapper, isDragged && styles.collapsed]}
      layout={LinearTransition}
    >
      {children}
    </Animated.View>
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
