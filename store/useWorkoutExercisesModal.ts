import { Exercise } from "@/types/exercises";
import { WorkoutExercise } from "@/types/workoutExercise";
import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (
    onPress: (
      exercises: Exercise[],
      newExerciseProperties?: Partial<WorkoutExercise>
    ) => void,
    allowMultiple: boolean,
    actionButtonLabel: "Add" | "Replace"
  ) => void;
  closeModal: () => void;
  onPress: (
    exercises: Exercise[],
    newExerciseProperties?: Partial<WorkoutExercise>
  ) => void;
  allowMultiple: boolean;
  actionButtonLabel: "Add" | "Replace";
}

const useWorkoutExercisesModal = create<ModalState>((set) => ({
  allowMultiple: true,
  isVisible: false,
  actionButtonLabel: "Add",
  openModal: (onPress, allowMultiple, actionButtonLabel) =>
    set({ isVisible: true, onPress, allowMultiple, actionButtonLabel }),
  closeModal: () => set({ isVisible: false }),
  onPress: () => {},
}));

export default useWorkoutExercisesModal;
