import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exerciseProps: ModalState["workoutProps"]) => void;
  closeModal: () => void;
  workoutProps: {
    workoutId: string;
    buttonRef: React.MutableRefObject<null>;
  };
}

const useWorkoutOptionsModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (workoutProps: ModalState["workoutProps"]) =>
    set({ isVisible: true, workoutProps }),
  closeModal: () => set({ isVisible: false }),
  workoutProps: {
    workoutId: "",
    buttonRef: { current: null },
  },
}));

export default useWorkoutOptionsModal;
