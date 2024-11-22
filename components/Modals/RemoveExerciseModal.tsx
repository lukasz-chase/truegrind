import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  exerciseName: string;
  exerciseId: string;
};

export default function RemoveExerciseModal({
  isVisible,
  closeModal,
  exerciseName,
  exerciseId,
}: Props) {
  const { removeExercise } = useActiveWorkout();
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Remove Exercise?</Text>
              <Text style={styles.subtitle}>
                This removes '{exerciseName}' and all of its sets from your
                workout. You cannot undo this action.
              </Text>
              <View style={styles.buttonsWrapper}>
                <Pressable style={styles.button} onPress={closeModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: AppColors.red }]}
                  onPress={() => removeExercise(exerciseId)}
                >
                  <Text style={[styles.buttonText, { color: "white" }]}>
                    Delete
                  </Text>
                </Pressable>
              </View>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    gap: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
  },
  buttonsWrapper: {
    flexDirection: "row",
    gap: 15,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    backgroundColor: AppColors.gray,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
