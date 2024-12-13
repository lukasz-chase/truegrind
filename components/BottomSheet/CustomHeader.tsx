import { useEffect, useMemo, useRef } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import { AppColors } from "@/constants/colors";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import useActiveWorkout from "@/store/useActiveWorkout";
import useAppStore from "@/store/useAppStore";
import {
  updateExerciseSets,
  updateWorkout,
  updateWorkoutExercises,
} from "@/lib/supabaseActions";
import TimerModal from "../Modals/TimerModal";
import useTimerStore from "@/store/useTimer";
import useWorkoutTimerModal from "@/store/useWorkoutTimerModal";
import TimerButton from "./TimerButton";
import uuid from "react-native-uuid";
import useCustomKeyboard from "@/store/useCustomKeyboard";

type Props = {
  sheetIndex: number;
  close: () => void;
  scrolledY: number;
};

const CustomHeader = ({ sheetIndex, close, scrolledY }: Props) => {
  const { animatedIndex, expand } = useBottomSheet();
  const {
    formattedTime,
    resetTimer,
    startTimer: startWorkoutTimer,
  } = useWorkoutTimer();
  const { endTimer, timeRemaining, isRunning, timerDuration } = useTimerStore();
  const {
    activeWorkout,
    initialActiveWorkout,
    workoutWasUpdated,
    isNewWorkout,
  } = useActiveWorkout();
  const { refetchData } = useAppStore();
  const { openModal, setButtonRef } = useWorkoutTimerModal();
  const { closeKeyboard } = useCustomKeyboard();

  const scrolledValue = useSharedValue(scrolledY);

  const buttonRef = useRef(null);

  useEffect(() => {
    setButtonRef(buttonRef);
    //Remove start timer not sure why it was here
  }, [buttonRef]);

  useEffect(() => {
    scrolledValue.value = scrolledY;
  }, [scrolledY]);

  useEffect(() => {
    startWorkoutTimer();
  }, []);

  const finishWorkout = async () => {
    closeKeyboard();
    if (!workoutWasUpdated) return;
    try {
      const workoutHistoryId = uuid.v4();
      await updateWorkout(
        activeWorkout,
        initialActiveWorkout,
        workoutHistoryId,
        isNewWorkout
      );
      const workoutExercisesHistoryIds =
        activeWorkout.workout_exercises?.map((workoutExercise) => ({
          historyId: uuid.v4(),
          id: workoutExercise.id,
        })) ?? [];
      await updateWorkoutExercises(
        activeWorkout,
        initialActiveWorkout,
        workoutHistoryId,
        workoutExercisesHistoryIds
      );
      await updateExerciseSets(
        activeWorkout,
        initialActiveWorkout,
        workoutExercisesHistoryIds
      );

      refetchData();
      close();
      resetTimer();
      endTimer();
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
      Extrapolation.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [styles.buttonContainer, containerAnimatedStyle],
    [containerAnimatedStyle]
  );

  const combinedAnimatedStyle = useAnimatedStyle(() => {
    const opacityReverse = interpolate(
      animatedIndex.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const opacityScroll = interpolate(
      scrolledValue.value,
      [0, 100],
      [0, 1],
      Extrapolation.CLAMP
    );

    // Blend the two animations into one style
    return {
      opacity: opacityReverse + opacityScroll,
    };
  });
  return (
    <>
      <Pressable
        style={styles.headerContainer}
        onPress={() => {
          if (sheetIndex === 0) expand();
        }}
        disabled={sheetIndex === 1}
      >
        <Animated.View style={containerStyle} ref={buttonRef}>
          <TimerButton
            openModal={openModal}
            isRunning={isRunning}
            timeRemaining={timeRemaining}
            totalDuration={timerDuration}
          />
        </Animated.View>

        <Animated.View style={[styles.titleContainer, combinedAnimatedStyle]}>
          <Text style={styles.headerTitle}>{activeWorkout.name}</Text>
          <Text style={styles.headerTitleTime}>{formattedTime}</Text>
        </Animated.View>

        <Animated.View style={containerStyle}>
          <Pressable style={styles.finishButton} onPress={finishWorkout}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </>
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
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  headerTitleTime: {
    fontSize: 18,
  },
  buttonContainer: {
    height: 40,
    width: 80,
    display: "flex",
    justifyContent: "center",
  },
  finishButton: {
    height: "100%",
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
