import { Workout } from "@/types/workout";
import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exerciseProps: ModalState["workoutProps"]) => void;
  closeModal: () => void;
  workoutProps: {
    workout: Workout | null;
    buttonRef: React.MutableRefObject<null>;
  };
}

const useWorkoutOptionsModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (workoutProps: ModalState["workoutProps"]) =>
    set({ isVisible: true, workoutProps }),
  closeModal: () => set({ isVisible: false }),
  workoutProps: {
    workout: null,
    buttonRef: { current: null },
  },
}));

export default useWorkoutOptionsModal;
