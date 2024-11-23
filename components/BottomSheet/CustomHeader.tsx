import React, { useEffect, useMemo } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import { AppColors } from "@/constants/colors";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import { supabase } from "@/lib/supabase";
import useActiveWorkout from "@/store/useActiveWorkout";
import { WorkoutExercise } from "@/types/workoutExercise";
import { ExerciseSet } from "@/types/exercisesSets";
import appStore from "@/store/appStore";
import {
  updateExerciseSets,
  updateWorkout,
  updateWorkoutExercises,
} from "@/lib/supabaseActions";

type Props = {
  sheetIndex: number;
  close: () => void;
};

const CustomHeader = ({ sheetIndex, close }: Props) => {
  const { animatedIndex, expand } = useBottomSheet();
  const { formattedTime, resetTimer, startTimer } = useWorkoutTimer();
  const { activeWorkout, initialActiveWorkout } = useActiveWorkout();
  const { setRefetchData } = appStore();

  useEffect(startTimer);

  const finishWorkout = async () => {
    try {
      await updateWorkout(activeWorkout, initialActiveWorkout);
      await updateWorkoutExercises(activeWorkout, initialActiveWorkout);
      await updateExerciseSets(activeWorkout, initialActiveWorkout);

      setRefetchData();
      close();
      resetTimer();
    } catch (error) {
      console.error("Error finishing workout:", error);
      throw error;
    }
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
        <Text style={styles.headerTitle}>{activeWorkout.name}</Text>
        <Text style={styles.headerTitleTime}>{formattedTime}</Text>
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
