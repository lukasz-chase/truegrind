import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import { Workout } from "@/types/workout";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  workout: Workout;
  openModal: () => void;
};

const WorkoutCard = ({ workout, openModal }: Props) => {
  const { setActiveWorkout } = useActiveWorkout();
  return (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => {
        setActiveWorkout(workout);
        if (Platform.OS !== "web") {
          Haptics.selectionAsync();
        }
        openModal();
      }}
    >
      <Text style={styles.workoutCardTitle}>{workout.name}</Text>
      {workout.workout_exercises
        ?.slice(0, 4)
        .map((workout: { id: string; exercises: { name: string } }) => (
          <Text
            key={workout.id}
            style={styles.workoutCardExercises}
            numberOfLines={1}
          >
            {workout.exercises.name}
          </Text>
        ))}
      {workout.workout_exercises!.length > 4 && (
        <Text style={styles.workoutCardExercises}>
          & {workout.workout_exercises!.length - 4} more
        </Text>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  workoutCard: {
    minHeight: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.black,
    width: "48%",
    padding: 10,
  },
  workoutCardTitle: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: "bold",
  },
  workoutCardExercises: {
    textOverflow: "ellipsis",
  },
});

export default WorkoutCard;
