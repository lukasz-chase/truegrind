import WorkoutBottomSheet from "@/components/BottomSheet/WorkoutBottomSheet";
import WorkoutPreviewModal from "@/components/Modals/WorkoutPreviewModal";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";
import useWorkoutPreviewModalStore from "@/store/useWorkoutPreviewModalStore";
import { Workout } from "@/types/workout";
import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native-ui-lib";

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const {
    isVisible: previewVisible,
    closeModal: closePreviewModal,
    openModal: openPreviewModal,
  } = useWorkoutPreviewModalStore();

  const [chosenWorkout, setChosenWorkout] = useState<Workout | null>(null);
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
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Start Workout</Text>
          <Button
            label={"Start an Empty Workout"}
            size={Button.sizes.large}
            style={styles.actionButton}
            onPress={() => setIsSheetVisible(true)}
          />
          <View style={styles.templateHeader}>
            <Text style={styles.templatesTitle}>Templates</Text>
            <Button
              label="+ Template"
              size="xSmall"
              style={styles.templatesButton}
            />
          </View>
          <Text>My Templates ({workouts.length})</Text>
          <ScrollView style={styles.workouts}>
            {workouts.map((workout) => (
              <TouchableOpacity
                style={styles.workoutCard}
                key={workout.id}
                onPress={() => {
                  setChosenWorkout(workout);
                  openPreviewModal();
                }}
              >
                <Text style={styles.workoutCardTitle}>{workout.name}</Text>
                {workout?.workout_exercises
                  .slice(0, 4)
                  .map(
                    (workout: { id: number; exercises: { name: string } }) => (
                      <Text
                        key={workout.id}
                        style={styles.workoutCardExercises}
                        numberOfLines={1}
                      >
                        {workout.exercises.name}
                      </Text>
                    )
                  )}
                {workout?.workout_exercises.length > 4 && (
                  <Text style={styles.workoutCardExercises}>
                    & {workout.workout_exercises.length - 4} more
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {chosenWorkout && (
          <>
            {previewVisible && (
              <WorkoutPreviewModal
                visible={previewVisible}
                onClose={closePreviewModal}
                workout={chosenWorkout}
                startWorkout={startWorkout}
              />
            )}
          </>
        )}
      </SafeAreaView>
      {isSheetVisible && chosenWorkout && (
        <WorkoutBottomSheet
          onClose={() => setIsSheetVisible(false)}
          workout={chosenWorkout}
        />
      )}
    </>
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
    color: "#25292e",
    paddingVertical: 20,
    fontWeight: "bold",
  },
  actionButton: {
    borderRadius: 10,
    backgroundColor: "#387bce",
  },
  templateHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  templatesTitle: {
    fontSize: 24,
    color: "#25292e",
    fontWeight: "bold",
  },
  templatesButton: {
    backgroundColor: "#387bce",
  },
  workouts: {
    display: "flex",
    marginTop: 20,
  },
  workoutCard: {
    minHeight: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#25292e",
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
