import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import { Workout } from "@/types/workout";
import React, { useRef } from "react";
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

type Props = {
  workout: Workout;
  openModal: () => void;
};

const WorkoutCard = ({ workout, openModal }: Props) => {
  const { setActiveWorkout } = useActiveWorkout();
  const { openModal: openOptionsModal } = useWorkoutOptionsModal();
  const buttonRef = useRef(null);

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
      <View style={styles.header}>
        <Text style={styles.workoutCardTitle}>{workout.name}</Text>
        <Pressable
          ref={buttonRef}
          onPress={() => openOptionsModal({ workoutId: workout.id, buttonRef })}
        >
          <SimpleLineIcons name="options" size={24} color={AppColors.blue} />
        </Pressable>
      </View>
      {workout.workout_exercises
        ?.sort((a, b) => a.order - b.order)
        .slice(0, 4)
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
    padding: 10,
    width: "48%",
  },
  workoutCardTitle: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: "bold",
  },
  workoutCardExercises: {
    textOverflow: "ellipsis",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default WorkoutCard;
