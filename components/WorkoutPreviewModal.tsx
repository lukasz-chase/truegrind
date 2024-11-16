import { supabase } from "@/lib/supabase";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ExerciseRow from "./ExerciseRow";

type Props = {
  visible: boolean;
  onClose: () => void;
  workoutId: number;
};

export default function WorkoutPreviewModal({
  visible,
  onClose,
  workoutId,
}: Props) {
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    if (workoutId) fetchWorkoutExercises();
  }, [workoutId]);

  const fetchWorkoutExercises = async () => {
    const { data } = await supabase
      .from("workout_exercises")
      .select(
        "*, exercise_sets(*), exercises(name, image, muscle, equipment), workouts(name)"
      )
      .eq("workout_id", workoutId);
    console.log(JSON.stringify(data, null, 2));
    if (data) {
      setExercises(data);
    }
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
              <View style={styles.modalHeader}>
                <Pressable style={styles.modalCloseButton} onPress={onClose}>
                  <EvilIcons name="close" size={24} color="black" />
                </Pressable>
                <Text style={styles.modalHeaderTitle}>
                  {exercises[0]?.workouts.name}
                </Text>
                <Pressable>
                  <Text style={styles.modalEditButton}>Edit</Text>
                </Pressable>
              </View>
              <FlatList
                style={styles.exercisesList}
                data={exercises}
                renderItem={({ item }) => (
                  <ExerciseRow
                    exercise={item.exercises}
                    exerciseSets={item.exercise_sets.length}
                  /> // Pass only the "exercises" fragment
                )}
                keyExtractor={(item) => item.id.toString()} // Ensure keyExtractor uses a string
              />
              <Pressable onPress={onClose} style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Start Workout</Text>
              </Pressable>
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
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  exercisesList: {
    width: "100%",
  },
  modalCloseButton: {
    backgroundColor: "#c1c1c1",
    padding: 4,
    borderRadius: 8,
  },
  modalHeaderTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  modalEditButton: {
    color: "#387bce",
    fontSize: 20,
  },
  actionButton: {
    width: "100%",
    backgroundColor: "#387bce",
    padding: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
