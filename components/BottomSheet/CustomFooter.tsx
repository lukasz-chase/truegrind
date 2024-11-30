import { AppColors } from "@/constants/colors";
import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import useActiveWorkout from "@/store/useActiveWorkout";
import { Exercise } from "@/types/exercises";
import useCustomKeyboard from "@/store/useCustomKeyboard";

type Props = {
  close: () => void;
};

const CustomFooter = ({ close }: Props) => {
  const { openModal, closeModal } = useWorkoutExercisesModal();
  const { addNewExercise } = useActiveWorkout();
  const { isVisible: IsKeyboardVisible } = useCustomKeyboard();
  const addExercise = (exercise: Exercise) => {
    addNewExercise(exercise);
    closeModal();
  };
  return (
    <>
      <Animated.View layout={LinearTransition}>
        <Pressable
          style={[styles.footerButton, styles.addExerciseButton]}
          onPress={() => {
            openModal(addExercise);
          }}
        >
          <Text style={[styles.footerText, styles.addExerciseButtonText]}>
            Add Exercises
          </Text>
        </Pressable>
        <Pressable
          style={[styles.footerButton, styles.cancelWorkoutButton]}
          onPress={close}
        >
          <Text style={[styles.footerText, styles.cancelWorkoutButtonText]}>
            Cancel Workout
          </Text>
        </Pressable>
        <View style={{ height: IsKeyboardVisible ? 100 : 50 }} />
      </Animated.View>
    </>
  );
};

export default CustomFooter;
const styles = StyleSheet.create({
  footerButton: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
  },
  addExerciseButton: {
    backgroundColor: AppColors.lightBlue,
  },
  cancelWorkoutButton: {
    backgroundColor: AppColors.lightRed,
  },
  addExerciseButtonText: {
    color: AppColors.blue,
  },
  cancelWorkoutButtonText: {
    color: AppColors.red,
  },
  footerText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
