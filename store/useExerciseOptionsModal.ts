import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exerciseProps: ModalState["exerciseProps"]) => void;
  closeModal: () => void;
  exerciseProps: {
    workoutExerciseId: string;
    exerciseName: string;
    exerciseTimer: number | null;
    warmupTimer: number | null;
    buttonRef: React.MutableRefObject<null>;
    note: { noteValue: string; showNote: boolean };
  };
  setExerciseTimer: (exerciseTimer: number | null) => void;
  setWarmupTimer: (warmupTimer: number | null) => void;
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
    warmupTimer: null,
    buttonRef: { current: null },
    note: { noteValue: "", showNote: false },
  },
  setExerciseTimer: (exerciseTimer: number | null) =>
    set((state) => ({
      ...state,
      exerciseProps: { ...state.exerciseProps, exerciseTimer },
    })),
  setWarmupTimer: (warmupTimer: number | null) =>
    set((state) => ({
      ...state,
      exerciseProps: { ...state.exerciseProps, warmupTimer },
    })),
}));

export default useExerciseOptionsModal;
