import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import useActiveWorkout from "@/store/useActiveWorkout";
import { Exercise } from "@/types/exercises";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import { WorkoutExercise } from "@/types/workoutExercise";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";

type Props = {
  close: () => void;
};

const CustomFooter = ({ close }: Props) => {
  const { openModal, closeModal } = useWorkoutExercisesModal();
  const { addNewWorkoutExercise, resetActiveWorkout } = useActiveWorkout();
  const { isVisible: IsKeyboardVisible } = useCustomKeyboard();
  const { resetTimer } = useWorkoutTimer();
  const { theme } = useThemeStore((state) => state);

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
    resetTimer();
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
