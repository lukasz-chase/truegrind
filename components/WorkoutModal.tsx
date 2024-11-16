import { supabase } from "@/lib/supabase";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  workoutId: number;
};

export default function WorkoutSessionModal({
  visible,
  onClose,
  workoutId,
}: Props) {
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentSets, setCurrentSets] = useState<any>({});

  useEffect(() => {
    if (workoutId) fetchWorkoutExercises();
  }, [workoutId]);

  const fetchWorkoutExercises = async () => {
    const { data } = await supabase
      .from("workout_exercises")
      .select("*, exercise_sets(*), exercises(name), workouts(name)")
      .eq("workout_id", workoutId);

    console.log(data);
    if (data) {
      setExercises(data);
    }
  };

  const handleSetUpdate = (exerciseId: string, set: number, value: any) => {
    setCurrentSets((prev: any) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [set]: value,
      },
    }));
  };

  const saveWorkout = async () => {
    await Promise.all(
      Object.entries(currentSets).map(async ([exerciseId, sets]) => {
        await supabase.from("exercise_history").insert({
          user_id: "user_1",
          exercise_id: exerciseId,
          sets: sets,
          date: new Date().toISOString(),
        });
      })
    );
    onClose(); // Close the modal after saving
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <ScrollView>
                {/* Your dynamic exercise content here */}
              </ScrollView>
              <Button title="Finish Workout" onPress={saveWorkout} />
              <Button title="Close" onPress={onClose} color="red" />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // padding outside the modal
  },
  modalContent: {
    width: "100%", // Adjust width as needed
    padding: 20,
    backgroundColor: "#FF6B6B", // modal background color
    borderRadius: 10,
    alignItems: "center",
  },
});
