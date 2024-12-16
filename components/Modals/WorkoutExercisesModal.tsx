import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Text,
} from "react-native";
import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import Exercises from "../ExercisesList/Exercises";
import { AppColors } from "@/constants/colors";
import CloseButton from "../CloseButton";
import { useState } from "react";
import NewExerciseModal from "./NewExerciseModal";
import { Exercise } from "@/types/exercises";

export default function WorkoutExercisesModal() {
  const {
    closeModal,
    isVisible,
    onPress,
    allowMultiple,
    actionButtonLabel,
    openModal,
  } = useWorkoutExercisesModal();
  const [openNewExerciseModal, setOpenNewExerciseModal] = useState(false);
  const [isNewExerciseModalVisible, setIsNewExerciseModalVisible] =
    useState(false);
  const [chosenExercises, setChosenExercises] = useState<Exercise[]>([]);

  const closeModalHandler = () => {
    setChosenExercises([]);
    closeModal();
  };

  const openNewExerciseModalHandler = () => {
    setOpenNewExerciseModal(true);
    closeModalHandler();
  };
  const addChosenExercises = (exercise: Exercise) => {
    const isAlreadyChosen = chosenExercises.find(
      (chosenExercise) => chosenExercise.id === exercise.id
    );
    if (isAlreadyChosen) {
      const filteredExercises = chosenExercises.filter(
        (chosenExercise) => chosenExercise.id !== exercise.id
      );
      setChosenExercises(filteredExercises);
      return;
    }
    if (allowMultiple) setChosenExercises((state) => [...state, exercise]);
    else setChosenExercises([exercise]);
  };
  const onPressHandler = () => {
    onPress(chosenExercises);
    setChosenExercises([]);
  };
  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={closeModal}
        onDismiss={() => {
          if (openNewExerciseModal) {
            setOpenNewExerciseModal(false);
            setIsNewExerciseModalVisible(true);
          }
        }}
      >
        <TouchableWithoutFeedback onPress={closeModalHandler}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerSection}>
              <CloseButton onPress={closeModalHandler} />
              <Pressable onPress={openNewExerciseModalHandler}>
                <Text style={[styles.headerText, { color: AppColors.blue }]}>
                  New
                </Text>
              </Pressable>
            </View>
            <View style={styles.headerSection}>
              <Text style={[styles.headerText, { color: AppColors.gray }]}>
                Superset
              </Text>
              <Pressable onPress={onPressHandler}>
                <Text
                  style={[
                    styles.headerText,
                    {
                      color:
                        chosenExercises.length > 0
                          ? AppColors.blue
                          : AppColors.gray,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {actionButtonLabel}
                </Text>
              </Pressable>
            </View>
          </View>
          <Exercises
            onPress={addChosenExercises}
            selectedExercises={chosenExercises}
          />
        </View>
      </Modal>
      <NewExerciseModal
        closeModal={() => {
          setIsNewExerciseModalVisible(false);
        }}
        isVisible={isNewExerciseModalVisible}
        onDismiss={() => openModal(onPress, true, "Add")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  modalContent: {
    width: "90%", // Adjust width as needed
    height: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
    margin: "auto",
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 18,
  },
});
