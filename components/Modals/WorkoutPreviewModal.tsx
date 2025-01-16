import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
} from "react-native";
import ExerciseRow from "../ExerciseRow";
import { Workout } from "@/types/workout";
import { AppColors } from "@/constants/colors";
import CloseButton from "../CloseButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  startWorkout: () => void;
  workout: Workout;
};

export default function WorkoutPreviewModal({
  visible,
  onClose,
  startWorkout,
  workout,
}: Props) {
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
                <CloseButton onPress={onClose} />
                <Text style={styles.modalHeaderTitle}>{workout.name}</Text>
                <Pressable>
                  <Text style={styles.modalEditButton}>Edit</Text>
                </Pressable>
              </View>
              <FlatList
                style={styles.exercisesList}
                data={workout.workout_exercises?.sort(
                  (a, b) => a.order - b.order
                )}
                renderItem={({ item }) => (
                  <View style={styles.workoutWrapper}>
                    {item.superset && (
                      <View
                        style={[
                          styles.supersetIndicator,
                          { backgroundColor: item.superset },
                        ]}
                      />
                    )}
                    <ExerciseRow
                      exercise={item.exercises}
                      numberOfSets={item.exercise_sets.length}
                      onPress={() => {}}
                      isSelected={false}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
              <Pressable onPress={startWorkout} style={styles.actionButton}>
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
    backgroundColor: AppColors.gray,
    padding: 4,
    borderRadius: 8,
  },
  modalHeaderTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  modalEditButton: {
    color: AppColors.blue,
    fontSize: 20,
  },
  actionButton: {
    width: "100%",
    backgroundColor: AppColors.blue,
    padding: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  workoutWrapper: {
    flexDirection: "row",
    gap: 6,
    paddingLeft: 6,
    paddingBottom: 6,
  },
  supersetIndicator: {
    width: 2,
    height: "100%",
  },
});
