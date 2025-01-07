import {
  exerciseDetailScreensEnum,
  exerciseDetailsScreenType,
} from "@/types/exerciseDetails";
import { Exercise } from "@/types/exercises";
import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exercise: Exercise) => void;
  closeModal: () => void;
  exercise: Exercise;
  screen: exerciseDetailsScreenType;
  setScreen: (screen: exerciseDetailsScreenType) => void;
}

const useExerciseDetailsModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (exercise) => set({ isVisible: true, exercise }),
  closeModal: () => set({ isVisible: false }),
  exercise: {
    equipment: "",
    id: "",
    name: "",
    muscle: "",
    user_id: "",
  },
  screen: exerciseDetailScreensEnum.About,
  setScreen: (screen) => set({ screen }),
}));

export default useExerciseDetailsModal;
