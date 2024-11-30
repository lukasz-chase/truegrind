import { Exercise } from "@/types/exercises";
import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (onPress: (exercise: Exercise) => void) => void;
  closeModal: () => void;
  onPress: (exercise: Exercise) => void;
}

const useWorkoutExercisesModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (onPress) => set({ isVisible: true, onPress }),
  closeModal: () => set({ isVisible: false }),
  onPress: () => {},
}));

export default useWorkoutExercisesModal;
