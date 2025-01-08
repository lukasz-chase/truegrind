import React, { useState } from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  LinearTransition,
} from "react-native-reanimated";
import useActiveWorkout from "@/store/useActiveWorkout";
import { AppColors } from "@/constants/colors";
import { ExerciseSet } from "@/types/exercisesSets";
import * as Haptics from "expo-haptics";
import CompleteSetButton from "./CompleteSetButton";
import userStore from "@/store/userStore";
import SetHistory from "./SetHistory";
import SetInput from "./SetInput";
import SetOrder from "./SetOrder";

type Props = {
  exerciseSet: ExerciseSet;
  exerciseId: string;
  exerciseTimer: number | null;
  warmupTimer: number | null;
};

const INITIAL_BUTTON_WIDTH = 70;
const BUTTON_MARGIN = 20;

const WorkoutSet = ({
  exerciseSet,
  exerciseId,
  exerciseTimer,
  warmupTimer,
}: Props) => {
  const translateX = useSharedValue(0);
  const rowScale = useSharedValue(1);
  const buttonWidth = useSharedValue(INITIAL_BUTTON_WIDTH);

  const [rowWidth, setRowWidth] = useState(0);
  const [hapticTriggered, setHapticTriggered] = useState(false);
  const [movedPassTreshold, setMovedPassTreshold] = useState(false);

  const { updateExerciseSet, deleteExerciseSet } = useActiveWorkout();
  const { user } = userStore();

  const updateSet = (newValue: any, name: keyof ExerciseSet) => {
    updateExerciseSetFields({ [name]: newValue });
  };

  const bulkUpdateSet = (newValue: Partial<ExerciseSet>) => {
    updateExerciseSet(exerciseId, exerciseSet.id, { ...newValue });
  };

  const updateExerciseSetFields = (newValues: Partial<ExerciseSet>) => {
    updateExerciseSet(exerciseId, exerciseSet.id, newValues);
  };

  const handleHapticFeedback = () => {
    if (!hapticTriggered || movedPassTreshold) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      setHapticTriggered(true);
    }
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 0])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -rowWidth);
        buttonWidth.value =
          INITIAL_BUTTON_WIDTH +
          BUTTON_MARGIN +
          Math.min(-translateX.value, rowWidth);

        if (translateX.value < -rowWidth * 0.5 && !hapticTriggered) {
          runOnJS(handleHapticFeedback)();
          runOnJS(setMovedPassTreshold)(true);
        }

        if (translateX.value >= -rowWidth * 0.5 && hapticTriggered) {
          runOnJS(handleHapticFeedback)();
          runOnJS(setMovedPassTreshold)(false);
          runOnJS(setHapticTriggered)(false);
        }
      }
    })
    .onEnd(() => {
      if (translateX.value < -rowWidth * 0.5) {
        translateX.value = withTiming(-rowWidth, {}, () =>
          runOnJS(deleteExerciseSet)(exerciseId, exerciseSet.id)
        );
        buttonWidth.value = withTiming(
          rowWidth + INITIAL_BUTTON_WIDTH + BUTTON_MARGIN
        );
      } else {
        translateX.value = withTiming(0);
        buttonWidth.value = withTiming(INITIAL_BUTTON_WIDTH);
        runOnJS(setHapticTriggered)(false);
        runOnJS(setMovedPassTreshold)(false);
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: rowScale.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
  }));
  return (
    <GestureHandlerRootView>
      <Animated.View
        layout={LinearTransition}
        style={[
          styles.container,
          {
            backgroundColor: exerciseSet.completed
              ? AppColors.lightGreen
              : "white",
          },
        ]}
        onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)} // Capture row width dynamically
      >
        <Animated.View
          style={[
            styles.deleteButtonContainer,
            deleteButtonStyle,
            {
              transform: [
                {
                  translateX: INITIAL_BUTTON_WIDTH + BUTTON_MARGIN,
                },
              ],
              alignItems: movedPassTreshold ? "flex-start" : "center",
            },
          ]}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Animated.View>

        <GestureHandlerRootView>
          <GestureDetector gesture={swipeGesture}>
            <Animated.View style={[styles.row, rowStyle]}>
              <View style={[styles.cell, { flex: 0.75 }]}>
                <SetOrder
                  isCompleted={exerciseSet.completed}
                  order={exerciseSet.order}
                  isWarmup={exerciseSet.is_warmup}
                  isDropset={exerciseSet.is_dropset}
                  exerciseId={exerciseId}
                  exerciseSetId={exerciseSet.id}
                />
              </View>
              <View style={[styles.cell, { flex: 1.75 }]}>
                <SetHistory
                  exerciseId={exerciseId}
                  setOrder={exerciseSet.order}
                  userId={user?.id!}
                  bulkUpdateSet={bulkUpdateSet}
                />
              </View>
              <View style={[styles.cell, { flex: 1.25 }]}>
                <SetInput
                  value={exerciseSet.weight}
                  completed={exerciseSet.completed}
                  exerciseSetId={exerciseSet.id}
                  updateSet={updateSet}
                  fieldName="weight"
                  updateStoreSetField={updateExerciseSetFields}
                  localStateRpeValue={exerciseSet.rpe}
                  localStatePartialsValue={exerciseSet.partials}
                />
              </View>

              <View style={[styles.cell, { flex: 1.25 }]}>
                <SetInput
                  value={exerciseSet.reps}
                  completed={exerciseSet.completed}
                  exerciseSetId={exerciseSet.id}
                  updateSet={updateSet}
                  fieldName="reps"
                  updateStoreSetField={updateExerciseSetFields}
                  localStateRpeValue={exerciseSet.rpe}
                  localStatePartialsValue={exerciseSet.partials}
                />
              </View>
              <View style={[styles.cell, { flex: 1, alignItems: "center" }]}>
                <CompleteSetButton
                  updateStoreSetField={updateExerciseSetFields}
                  completed={exerciseSet.completed}
                  reps={exerciseSet.reps}
                  rowScale={rowScale}
                  exerciseTimer={exerciseTimer}
                  weight={exerciseSet.weight}
                  isWarmup={exerciseSet.is_warmup}
                  warmupTimer={warmupTimer}
                />
              </View>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingHorizontal: 10,
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "red",
    justifyContent: "center",
    borderRadius: 8,
    paddingInline: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  cell: {
    paddingVertical: 10,
    textAlign: "center",
    justifyContent: "center",
  },
});

export default WorkoutSet;
