import useActiveWorkout from "@/store/useActiveWorkout";
import { Workout } from "@/types/workout";
import React, { useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { SimpleLineIcons } from "@expo/vector-icons";
import useWorkoutOptionsModal from "@/store/useWorkoutOptionsModal";
import WorkoutPreviewModal from "./Modals/WorkoutPreviewModal";
import useBottomSheet from "@/store/useBottomSheet";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

const WORKOUT_EXERCISE_NAMES_TO_SHOW = 3;

type Props = {
  workout: Workout;
  onLongPress?: () => void;
  isActive?: boolean;
};

const WorkoutCard = ({ workout, onLongPress, isActive }: Props) => {
  const [isWorkoutPreviewModalVisible, setIsWorkoutPreviewModalVisible] =
    useState(false);

  const { openModal: openOptionsModal } = useWorkoutOptionsModal();

  const { setActiveWorkout, setIsNewWorkout } = useActiveWorkout();
  const { setIsSheetVisible } = useBottomSheet();

  const buttonRef = useRef(null);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const startWorkout = () => {
    setIsNewWorkout(false);
    setIsWorkoutPreviewModalVisible(false);
    setIsSheetVisible(true);
    setActiveWorkout(workout, true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.workoutCard,
          isActive && { opacity: 0.8, transform: [{ scale: 0.97 }] },
        ]}
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.selectionAsync();
          }
          setIsWorkoutPreviewModalVisible(true);
        }}
        onLongPress={() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          if (onLongPress) onLongPress();
        }}
      >
        <View style={styles.header}>
          <Text style={[styles.workoutCardTitle]}>{workout.name}</Text>
          <Pressable
            ref={buttonRef}
            onPress={() => openOptionsModal({ workout, buttonRef })}
          >
            <SimpleLineIcons name="options" size={24} color={theme.blue} />
          </Pressable>
        </View>
        <View style={styles.workoutCardExercisesContainer}>
          {workout.workout_exercises
            ?.sort((a, b) => a.order - b.order)
            .slice(0, WORKOUT_EXERCISE_NAMES_TO_SHOW)
            .map((workout: { id: string; exercises: { name: string } }) => (
              <Text
                key={workout.id}
                style={styles.workoutCardExercises}
                numberOfLines={1}
              >
                {workout.exercises.name}
              </Text>
            ))}
          {workout.workout_exercises!.length >
            WORKOUT_EXERCISE_NAMES_TO_SHOW && (
            <Text style={styles.workoutCardExercises}>
              &{" "}
              {workout.workout_exercises!.length -
                WORKOUT_EXERCISE_NAMES_TO_SHOW}{" "}
              more
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <WorkoutPreviewModal
        visible={isWorkoutPreviewModalVisible}
        onClose={() => setIsWorkoutPreviewModalVisible(false)}
        workout={workout}
        startWorkout={startWorkout}
      />
    </>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    workoutCard: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.textColor,
      padding: 10,
      flex: 1,
    },
    workoutCardTitle: {
      fontSize: 18,
      paddingBottom: 5,
      fontWeight: "bold",
      color: theme.textColor,
    },
    workoutCardExercisesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      gap: 5,
    },
    workoutCardExercises: {
      width: "48%",
      marginBottom: 4,
      color: theme.lightText,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });

export default WorkoutCard;
