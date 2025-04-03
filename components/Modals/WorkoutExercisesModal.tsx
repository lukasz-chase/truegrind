import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Text,
  Platform,
} from "react-native";
import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import Exercises from "../ExercisesList/Exercises";
import { AppColors } from "@/constants/colors";
import CloseButton from "../CloseButton";
import { useState } from "react";
import ExerciseFormModal from "./ExerciseForm/ExerciseFormModal";
import { Exercise } from "@/types/exercises";
import useActiveWorkout from "@/store/useActiveWorkout";
import { generateNewColor } from "@/lib/helpers";
import { WorkoutExercise } from "@/types/workoutExercise";
import * as Haptics from "expo-haptics";

export default function WorkoutExercisesModal() {
  const {
    closeModal,
    isVisible,
    onPress,
    allowMultiple,
    actionButtonLabel,
    openModal,
  } = useWorkoutExercisesModal();
  const { activeWorkout } = useActiveWorkout();
  const [isNewExerciseModalVisible, setIsNewExerciseModalVisible] =
    useState(false);
  const [chosenExercises, setChosenExercises] = useState<Exercise[]>([]);

  const closeModalHandler = () => {
    setChosenExercises([]);
    closeModal();
  };

  const openNewExerciseModalHandler = () => {
    setIsNewExerciseModalVisible(true);
    closeModalHandler();
  };
  const addChosenExercises = (exercise: Exercise) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
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
  const onPressHandler = (newExerciseProperties?: Partial<WorkoutExercise>) => {
    onPress(chosenExercises, newExerciseProperties);
    setChosenExercises([]);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const supersetExercisesHandler = () => {
    const currentSupersetColors = activeWorkout.workout_exercises?.map(
      (exercise) => exercise.superset
    );
    const supersetColor = generateNewColor(currentSupersetColors);
    onPressHandler({ superset: supersetColor });
  };
  const closeExerciseFormModalHandler = (exercise: Exercise | undefined) => {
    openModal(onPress, true, "Add");
    if (exercise) {
      setChosenExercises([exercise]);
    }
    setIsNewExerciseModalVisible(false);
  };
  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={closeModal}
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
              <Pressable
                onPress={supersetExercisesHandler}
                disabled={chosenExercises.length <= 1}
              >
                <Text
                  style={[
                    styles.headerText,
                    {
                      color:
                        chosenExercises.length > 1
                          ? AppColors.blue
                          : AppColors.gray,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Superset
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onPressHandler()}
                disabled={chosenExercises.length < 1}
              >
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
                  {actionButtonLabel === "Add" && `(${chosenExercises.length})`}
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
      <ExerciseFormModal
        closeModal={closeExerciseFormModalHandler}
        isVisible={isNewExerciseModalVisible}
        title="Add New Exercise"
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: AppColors.semiTransparent, // semi-transparent background
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
    backgroundColor: AppColors.white,
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
