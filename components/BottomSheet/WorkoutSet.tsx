import React, { useState } from "react";
import {
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
  StyleSheet,
} from "react-native";
import { Pressable } from "react-native";
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
import AntDesign from "@expo/vector-icons/AntDesign";
import useActiveWorkout from "@/store/useActiveWorkout";
import { AppColors } from "@/constants/colors";
import { ExerciseSet } from "@/types/exercisesSets";
import * as Haptics from "expo-haptics";

type Props = {
  exerciseSet: ExerciseSet;
  exerciseId: string;
};

const WorkoutSet = ({ exerciseSet, exerciseId }: Props) => {
  const translateX = useSharedValue(0);
  const rowScale = useSharedValue(1);
  const initialButtonWidth = 70;
  const buttonMargin = 20;
  const buttonWidth = useSharedValue(initialButtonWidth);
  const [rowWidth, setRowWidth] = useState(0);
  const [hapticTriggered, setHapticTriggered] = useState(false);
  const [movedPassTreshold, setMovedPassTreshold] = useState(false);
  const { initialActiveWorkout, updateExerciseSet, deleteExerciseSet } =
    useActiveWorkout();

  const exerciseHistory = initialActiveWorkout.workout_exercises?.find(
    (e) => e.exercises.id === exerciseId
  );

  const updateExerciseField = (
    newValue: any,
    setId: string,
    name: keyof ExerciseSet
  ) => {
    updateExerciseSet(exerciseId, setId, name, newValue);
  };

  const renderPreviousSet = (set: ExerciseSet) => {
    const previousSet = exerciseHistory?.exercise_sets.find(
      (s) => s.order === set.order
    );
    if (!previousSet || previousSet.reps === null) return `-`;
    return `${previousSet.reps} x ${previousSet.weight}`;
  };

  const handleHapticFeedback = () => {
    if (!hapticTriggered || movedPassTreshold) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setHapticTriggered(true);
    }
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 0])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -rowWidth);
        buttonWidth.value =
          initialButtonWidth +
          buttonMargin +
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
          rowWidth + initialButtonWidth + buttonMargin
        );
      } else {
        translateX.value = withTiming(0);
        buttonWidth.value = withTiming(initialButtonWidth);
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

  const completeSet = () => {
    updateExerciseField(!exerciseSet.completed, exerciseSet.id, "completed");

    if (!exerciseSet.completed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      rowScale.value = withTiming(1.1, { duration: 100 }, () => {
        rowScale.value = withTiming(1, { duration: 100 });
      });
    } else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

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
                  translateX: initialButtonWidth + buttonMargin,
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
              <View style={[styles.cell, { flex: 1 }]}>
                <Pressable
                  style={[
                    styles.rowButton,
                    {
                      backgroundColor: exerciseSet.completed
                        ? AppColors.lightGreen
                        : AppColors.gray,
                    },
                  ]}
                >
                  <Text style={[styles.cellText, styles.rowButtonText]}>
                    {exerciseSet.order}
                  </Text>
                </Pressable>
              </View>

              <Text style={[styles.cell, { flex: 2 }]}>
                {renderPreviousSet(exerciseSet)}
              </Text>
              <TextInput
                value={`${exerciseSet?.reps ?? ""}`}
                onChange={(e) =>
                  updateExerciseField(
                    e.nativeEvent.text,
                    exerciseSet.id,
                    "reps"
                  )
                }
                style={[
                  styles.cell,
                  styles.textInput,
                  {
                    flex: 1,
                    backgroundColor: exerciseSet.completed
                      ? AppColors.lightGreen
                      : AppColors.gray,
                  },
                ]}
              />
              <TextInput
                value={`${exerciseSet?.weight ?? ""}`}
                onChange={(e) =>
                  updateExerciseField(
                    e.nativeEvent.text,
                    exerciseSet.id,
                    "weight"
                  )
                }
                style={[
                  styles.cell,
                  styles.textInput,
                  {
                    flex: 1,
                    backgroundColor: exerciseSet.completed
                      ? AppColors.lightGreen
                      : AppColors.gray,
                  },
                ]}
              />
              <View style={[styles.cell, { flex: 1, alignItems: "center" }]}>
                <Pressable
                  style={[
                    styles.rowButton,
                    {
                      backgroundColor: exerciseSet.completed
                        ? AppColors.green
                        : AppColors.gray,
                    },
                  ]}
                  onPress={completeSet}
                >
                  <AntDesign
                    name="check"
                    size={20}
                    color={exerciseSet.completed ? "white" : "black"}
                  />
                </Pressable>
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
    paddingHorizontal: 5,
    textAlign: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 14,
  },
  textInput: {
    backgroundColor: AppColors.gray,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 16,
    height: 30,
  },
  rowButton: {
    backgroundColor: AppColors.gray,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    paddingHorizontal: 10,
  },
  rowButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutSet;
