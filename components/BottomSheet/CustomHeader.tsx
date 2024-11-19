import React, { useMemo } from "react";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomSheet } from "@gorhom/bottom-sheet";

type Props = { workoutName: string; sheetIndex: number; close: () => void };

const CustomHeader = ({ workoutName, sheetIndex, close }: Props) => {
  const { animatedIndex, expand } = useBottomSheet();

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [styles.timerButtonContainer, containerAnimatedStyle],
    [containerAnimatedStyle]
  );

  const containerAnimatedStyleReverse = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  const finishWorkout = () => {
    close();
  };

  return (
    <Pressable
      style={styles.headerContainer}
      onPress={() => {
        if (sheetIndex === 0) expand(); // Only expand when collapsed
      }}
      disabled={sheetIndex === 1} // Disable pressability when expanded
    >
      {/* Left button */}
      <Animated.View style={containerStyle}>
        <Pressable style={styles.timerButton}>
          <Ionicons name="timer-outline" size={24} color="black" />
        </Pressable>
      </Animated.View>

      {/* Title and time */}
      <Animated.View
        style={[styles.titleContainer, containerAnimatedStyleReverse]}
      >
        <Text style={styles.headerTitle}>{workoutName}</Text>
        <Text style={styles.headerTitleTime}>6:30</Text>
      </Animated.View>

      {/* Finish button */}
      <Animated.View style={containerStyle}>
        <Pressable
          style={styles.headerButton}
          onPress={finishWorkout} // Corrected missing invocation
        >
          <Text style={styles.headerButtonText}>Finish</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
    marginTop: -5,
  },
  titleContainer: {
    alignItems: "center",
    gap: 4,
    fontSize: 14,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  headerTitleTime: {
    fontSize: 14,
  },
  timerButtonContainer: {
    width: 80,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  timerButton: {
    backgroundColor: "#c1c1c1",
    padding: 10,
    width: 52,
    borderRadius: 10,
    alignItems: "center",
  },
  headerButton: {
    backgroundColor: "#26c233",
    padding: 10,
    borderRadius: 10,
    width: 80,
  },
  headerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default CustomHeader;
