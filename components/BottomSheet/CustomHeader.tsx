import { useEffect, useMemo, useRef } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text } from "react-native";
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

type Props = {
  sheetIndex: number;
  close: () => void;
};

const CustomHeader = ({ sheetIndex, close }: Props) => {
  const { animatedIndex, expand } = useBottomSheet();
  const { formattedTime, resetTimer, startTimer } = useWorkoutTimer();
  const { endTimer, timeRemaining, isRunning, timerDuration } = useTimerStore();
  const { activeWorkout, initialActiveWorkout } = useActiveWorkout();
  const { refetchData } = useAppStore();
  const { isVisible, closeModal, openModal } = useWorkoutTimerModal();

  const buttonRef = useRef(null);

  useEffect(startTimer);

  const finishWorkout = async () => {
    try {
      await updateWorkout(activeWorkout, initialActiveWorkout);
      await updateWorkoutExercises(activeWorkout, initialActiveWorkout);
      await updateExerciseSets(activeWorkout, initialActiveWorkout);

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
      Extrapolate.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [styles.buttonContainer, containerAnimatedStyle],
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
      <TimerModal
        isVisible={isVisible}
        closeModal={closeModal}
        buttonRef={buttonRef}
      />
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
    fontSize: 14,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  headerTitleTime: {
    fontSize: 14,
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
