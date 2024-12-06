import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exerciseProps: ModalState["exerciseProps"]) => void;
  closeModal: () => void;
  exerciseProps: {
    workoutExerciseId: string;
    exerciseName: string;
    exerciseTimer: number | null;
    buttonRef: React.MutableRefObject<null>;
  };
}

const useExerciseOptionsModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (exerciseProps: ModalState["exerciseProps"]) =>
    set({ isVisible: true, exerciseProps }),
  closeModal: () => set({ isVisible: false }),
  exerciseProps: {
    workoutExerciseId: "",
    exerciseName: "",
    exerciseTimer: null,
    buttonRef: { current: null },
  },
}));

export default useExerciseOptionsModal;
