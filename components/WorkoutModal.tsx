import { supabase } from "@/lib/supabase";
import { Workout } from "@/types/workout";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  workout: Workout;
};

export default function WorkoutSessionModal({
  visible,
  onClose,
  workout,
}: Props) {
  const [currentSets, setCurrentSets] = useState<any>({});

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
              <Pressable onPress={saveWorkout}>
                <Text>Finish Workout</Text>
              </Pressable>
              <Pressable onPress={onClose}>
                <Text>Cancel</Text>
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
    backgroundColor: "white", // modal background color
    borderRadius: 10,
    alignItems: "center",
  },
});
