import WorkoutPreviewModal from "@/components/Modals/WorkoutPreviewModal";
import { AppColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import useBottomSheet from "@/store/useBottomSheet";
import userStore from "@/store/userStore";
import useWorkoutPreviewModalStore from "@/store/useWorkoutPreviewModalStore";
import { Workout } from "@/types/workout";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const {
    isVisible: previewVisible,
    closeModal: closePreviewModal,
    openModal: openPreviewModal,
  } = useWorkoutPreviewModalStore();
  const { activeWorkout, setIsSheetVisible, setActiveWorkout } =
    useBottomSheet();

  const { session } = userStore((state) => state);
  useEffect(() => {
    fetchWorkouts();
  }, [session]);

  const fetchWorkouts = async () => {
    try {
      const { data } = await supabase
        .from("workouts")
        .select(
          `id, name,  workout_exercises(id, exercises(name, image, muscle, equipment), exercise_sets(*))`
        )
        .eq("user_id", session?.user?.id)
        .returns<Workout[]>();
      if (data) {
        setWorkouts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startWorkout = () => {
    closePreviewModal();
    setIsSheetVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Start Workout</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsSheetVisible(true)}
        >
          <Text style={styles.actionButtonText}>Start an Empty Workout</Text>
        </TouchableOpacity>
        <View style={styles.templateHeader}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <TouchableOpacity style={styles.templatesButton}>
            <Text style={styles.templatesButtonText}>+ Template</Text>
          </TouchableOpacity>
        </View>
        <Text>My Templates ({workouts.length})</Text>
        <ScrollView style={styles.workouts}>
          {workouts.map((workout) => (
            <TouchableOpacity
              style={styles.workoutCard}
              key={workout.id}
              onPress={() => {
                setActiveWorkout(workout);
                openPreviewModal();
              }}
            >
              <Text style={styles.workoutCardTitle}>{workout.name}</Text>
              {workout.workout_exercises
                ?.slice(0, 4)
                .map((workout: { id: number; exercises: { name: string } }) => (
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
          ))}
        </ScrollView>
      </View>
      {activeWorkout && (
        <>
          {previewVisible && (
            <WorkoutPreviewModal
              visible={previewVisible}
              onClose={closePreviewModal}
              workout={activeWorkout}
              startWorkout={startWorkout}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: AppColors.black,
    paddingVertical: 20,
    fontWeight: "bold",
  },
  actionButton: {
    borderRadius: 10,
    backgroundColor: AppColors.blue,
    padding: 10,
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  templateHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  templatesTitle: {
    fontSize: 24,
    color: AppColors.black,
    fontWeight: "bold",
  },
  templatesButton: {
    padding: 4,
    borderRadius: 10,
    backgroundColor: AppColors.lightBlue,
  },
  templatesButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: AppColors.blue,
  },
  workouts: {
    display: "flex",
    marginTop: 20,
  },
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
