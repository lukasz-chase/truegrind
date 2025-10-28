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
import CloseButton from "../CloseButton";
import { useMemo, useState } from "react";
import ExerciseFormModal from "./ExerciseForm/ExerciseFormModal";
import { Exercise } from "@/types/exercises";
import useActiveWorkout from "@/store/useActiveWorkout";
import { WorkoutExercise } from "@/types/workoutExercise";
import * as Haptics from "expo-haptics";
import { generateNewColor } from "@/utils/colors";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useShallow } from "zustand/shallow";

export default function WorkoutExercisesModal() {
  const {
    closeModal,
    isVisible,
    onPress,
    allowMultiple,
    actionButtonLabel,
    openModal,
  } = useWorkoutExercisesModal(
    useShallow((state) => ({
      closeModal: state.closeModal,
      isVisible: state.isVisible,
      onPress: state.onPress,
      allowMultiple: state.allowMultiple,
      actionButtonLabel: state.actionButtonLabel,
      openModal: state.openModal,
    }))
  );
  const activeWorkout = useActiveWorkout((state) => state.activeWorkout);
  const [isNewExerciseModalVisible, setIsNewExerciseModalVisible] =
    useState(false);
  const [chosenExercises, setChosenExercises] = useState<Exercise[]>([]);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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
                <Text style={[styles.headerText, { color: theme.blue }]}>
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
                        chosenExercises.length > 1 ? theme.blue : theme.gray,
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
                        chosenExercises.length > 0 ? theme.blue : theme.gray,
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      backgroundColor: theme.semiTransparent, // semi-transparent background
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
      backgroundColor: theme.background,
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
