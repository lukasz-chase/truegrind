import React, { useEffect, useMemo, useState } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import { AppColors } from "@/constants/colors";

type Props = {
  workoutName: string;
  sheetIndex: number;
  close: () => void;
  setWorkoutElapsedTime: React.Dispatch<React.SetStateAction<number>>;
  workoutElapsedTime: number;
};

const CustomHeader = ({
  workoutName,
  sheetIndex,
  close,
  workoutElapsedTime,
  setWorkoutElapsedTime,
}: Props) => {
  const [startTime, setStartTime] = useState(0); // Timestamp when the timer starts
  const [isRunning, setIsRunning] = useState(false);
  const { animatedIndex, expand } = useBottomSheet();

  useEffect(() => {
    let timer: any;

    if (isRunning) {
      timer = setInterval(() => {
        setWorkoutElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100); // Update every 100ms for smoothness
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(Date.now() - workoutElapsedTime * 1000); // Maintain continuity
      setIsRunning(true);
    }
  };
  useEffect(handleStart);
  const handleReset = () => {
    setIsRunning(false);
    setWorkoutElapsedTime(0);
    setStartTime(0);
  };
  const finishWorkout = () => {
    handleReset();
    close();
  };
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

  return (
    <Pressable
      style={styles.headerContainer}
      onPress={() => {
        if (sheetIndex === 0) expand();
      }}
      disabled={sheetIndex === 1}
    >
      <Animated.View style={containerStyle}>
        <Pressable style={styles.timerButton}>
          <Ionicons name="timer-outline" size={24} color="black" />
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[styles.titleContainer, containerAnimatedStyleReverse]}
      >
        <Text style={styles.headerTitle}>{workoutName}</Text>
        <Text style={styles.headerTitleTime}>
          {Math.floor(workoutElapsedTime / 60)}:
          {String(workoutElapsedTime % 60).padStart(2, "0")}
        </Text>
      </Animated.View>

      <Animated.View style={containerStyle}>
        <Pressable style={styles.finishButton} onPress={finishWorkout}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    marginTop: -5,
    paddingHorizontal: 20,
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
  },
  timerButton: {
    backgroundColor: AppColors.gray,
    padding: 10,
    width: 52,
    borderRadius: 10,
    alignItems: "center",
  },
  finishButton: {
    backgroundColor: AppColors.green,
    padding: 10,
    borderRadius: 10,
    width: 80,
  },
  finishButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default CustomHeader;
