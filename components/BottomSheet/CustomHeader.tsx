import { useEffect, useMemo, useRef, useState } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import { AppColors } from "@/constants/colors";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import useActiveWorkout from "@/store/useActiveWorkout";
import useTimerStore from "@/store/useTimer";
import useWorkoutTimerModal from "@/store/useWorkoutTimerModal";
import TimerButton from "./TimerButton";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import { useRouter } from "expo-router";
import useActionModal from "@/store/useActionModal";

type Props = {
  sheetIndex: number;
  close: () => void;
  scrolledY: number;
};

const CustomHeader = ({ sheetIndex, close, scrolledY }: Props) => {
  const { animatedIndex, expand } = useBottomSheet();
  const {
    formattedTime,
    isRunning: isWorkoutTimerRunning,
    startTimer: startWorkoutTimer,
    resumeIfRunning,
  } = useWorkoutTimer();
  const { timeRemaining, isRunning, timerDuration } = useTimerStore();
  const { activeWorkout, setActiveWorkout } = useActiveWorkout();
  const { openModal, setButtonRef } = useWorkoutTimerModal();
  const { closeKeyboard } = useCustomKeyboard();
  const { openModal: openActionModal } = useActionModal();

  const router = useRouter();

  const scrolledValue = useSharedValue(scrolledY);

  const buttonRef = useRef(null);

  useEffect(() => {
    setButtonRef(buttonRef);
  }, [buttonRef]);

  useEffect(() => {
    scrolledValue.value = scrolledY;
  }, [scrolledY]);

  useEffect(() => {
    if (!isWorkoutTimerRunning) startWorkoutTimer();
    else resumeIfRunning();
  }, [isWorkoutTimerRunning]);

  const finishWorkoutHandler = () => {
    const notCompletedSets = activeWorkout.workout_exercises?.some((exercise) =>
      exercise.exercise_sets?.some((set) => !set.completed)
    );
    if (notCompletedSets) {
      openActionModal({
        title: "Finish Workout?",
        subtitle: `All invalid or empty sets will be removed.`,
        onProceed: removeNotCompletedSets,
        proceedButtonBgColor: AppColors.green,
        proceedButtonLabeL: "Finish",
      });
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    closeKeyboard();
    router.navigate(`/workoutFinished`);
    close();
  };
  const removeNotCompletedSets = () => {
    const workoutWithoutNotCompletedSets = activeWorkout.workout_exercises?.map(
      (exercise) => ({
        ...exercise,
        exercise_sets: exercise.exercise_sets?.filter((set) => set.completed),
      })
    );
    setActiveWorkout(
      {
        ...activeWorkout,
        workout_exercises: workoutWithoutNotCompletedSets,
      },
      false
    );
    finishWorkout();
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
      flex: animatedIndex.value === 1 ? 2 : 4,
    };
  });
  return (
    <Pressable
      style={styles.headerContainer}
      onPress={() => {
        if (sheetIndex === 0) expand();
      }}
      disabled={sheetIndex === 1}
    >
      <Animated.View style={[containerStyle]} ref={buttonRef}>
        <TimerButton
          openModal={openModal}
          isRunning={isRunning}
          timeRemaining={timeRemaining}
          totalDuration={timerDuration}
        />
      </Animated.View>

      <Animated.View style={[styles.titleContainer, combinedAnimatedStyle]}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {activeWorkout.name}
        </Text>
        <Text style={styles.headerTitleTime}>{formattedTime}</Text>
      </Animated.View>

      <Animated.View style={[containerStyle, { alignItems: "flex-end" }]}>
        <Pressable style={styles.finishButton} onPress={finishWorkoutHandler}>
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
    fontSize: 16,
    textOverflow: "ellipsis",
  },
  headerTitleTime: {
    fontSize: 18,
  },
  buttonContainer: {
    height: 40,
    display: "flex",
    justifyContent: "center",
    flex: 1,
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
