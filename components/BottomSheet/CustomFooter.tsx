import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import useActiveWorkout from "@/store/useActiveWorkout";
import { Exercise } from "@/types/exercises";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import { WorkoutExercise } from "@/types/workoutExercise";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";
import useTimerStore from "@/store/useTimer";
import { useShallow } from "zustand/shallow";

type Props = {
  theme: ThemeColors;
  close: () => void;
};

const CustomFooter = ({ close, theme }: Props) => {
  const { openModal, closeModal } = useWorkoutExercisesModal(
    useShallow((state) => ({
      openModal: state.openModal,
      closeModal: state.closeModal,
    }))
  );
  const { addNewWorkoutExercise, resetActiveWorkout } = useActiveWorkout(
    useShallow((state) => ({
      addNewWorkoutExercise: state.addNewWorkoutExercise,
      resetActiveWorkout: state.resetActiveWorkout,
    }))
  );
  const IsKeyboardVisible = useCustomKeyboard((state) => state.isVisible);
  const resetExerciseTimer = useWorkoutTimer((state) => state.resetTimer);
  const stopWorkoutTimer = useTimerStore((state) => state.endTimer);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const addExercises = async (
    exercises: Exercise[],
    newExerciseProperties?: Partial<WorkoutExercise>
  ) => {
    exercises.map(
      async (exercise) =>
        await addNewWorkoutExercise(exercise, newExerciseProperties)
    );
    closeModal();
  };
  const closeBottomSheet = () => {
    resetExerciseTimer();
    stopWorkoutTimer();
    close();
    resetActiveWorkout();
  };
  return (
    <Animated.View layout={LinearTransition}>
      <Pressable
        style={[styles.footerButton, styles.addExerciseButton]}
        onPress={() => {
          openModal(addExercises, true, "Add");
        }}
      >
        <Text style={[styles.footerText, styles.addExerciseButtonText]}>
          Add Exercises
        </Text>
      </Pressable>
      <Pressable
        style={[styles.footerButton, styles.cancelWorkoutButton]}
        onPress={closeBottomSheet}
      >
        <Text style={[styles.footerText, styles.cancelWorkoutButtonText]}>
          Cancel Workout
        </Text>
      </Pressable>
      <View style={{ height: IsKeyboardVisible ? 100 : 50 }} />
    </Animated.View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    footerButton: {
      padding: 12,
      margin: 12,
      borderRadius: 12,
    },
    addExerciseButton: {
      backgroundColor: theme.lightBlue,
    },
    cancelWorkoutButton: {
      backgroundColor: theme.lightRed,
    },
    addExerciseButtonText: {
      color: theme.blue,
    },
    cancelWorkoutButtonText: {
      color: theme.red,
    },
    footerText: {
      textAlign: "center",
      fontWeight: "bold",
    },
  });
export default CustomFooter;
