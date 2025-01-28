import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import { Workout } from "@/types/workout";
import React, { useRef, useState } from "react";
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

type Props = {
  workout: Workout;
};

const WorkoutCard = ({ workout }: Props) => {
  const [isWorkoutPreviewModalVisible, setIsWorkoutPreviewModalVisible] =
    useState(false);

  const { openModal: openOptionsModal } = useWorkoutOptionsModal();

  const { setActiveWorkout, setIsNewWorkout } = useActiveWorkout();
  const { setIsSheetVisible } = useBottomSheet();

  const buttonRef = useRef(null);

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
        style={styles.workoutCard}
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.selectionAsync();
          }
          setIsWorkoutPreviewModalVisible(true);
        }}
      >
        <View style={styles.header}>
          <Text style={[styles.workoutCardTitle, { flex: 2 }]}>
            {workout.name}
          </Text>
          <Pressable
            ref={buttonRef}
            style={{ flex: 0.5 }}
            onPress={() => openOptionsModal({ workout, buttonRef })}
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
      <WorkoutPreviewModal
        visible={isWorkoutPreviewModalVisible}
        onClose={() => setIsWorkoutPreviewModalVisible(false)}
        workout={workout}
        startWorkout={startWorkout}
      />
    </>
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
    fontSize: 18,
    paddingBottom: 5,
    fontWeight: "bold",
  },
  workoutCardExercises: {
    textOverflow: "ellipsis",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default WorkoutCard;
