import { WorkoutExercisePopulated } from "@/types/workoutExercise";
import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  isEditTemplate: boolean;
  openModal: (
    buttonRef: React.MutableRefObject<null>,
    workoutExercise: WorkoutExercisePopulated,
    isEditTemplate: boolean,
  ) => void;
  closeModal: () => void;
  workoutExercise: null | WorkoutExercisePopulated;
  buttonRef: null | React.MutableRefObject<null>;
  setExerciseTimer: (exerciseTimer: number | null) => void;
  setWarmupTimer: (warmupTimer: number | null) => void;
}

const useExerciseOptionsModal = create<ModalState>((set) => ({
  isVisible: false,
  isEditTemplate: false,
  openModal: (buttonRef, workoutExercise, isEditTemplate = false) =>
    set({ isVisible: true, buttonRef, workoutExercise, isEditTemplate }),
  closeModal: () => set({ isVisible: false }),
  workoutExercise: null,
  buttonRef: null,
  setExerciseTimer: (exerciseTimer: number | null) =>
    set((state) => ({
      ...state,
      workoutExercise: { ...state.workoutExercise!, timer: exerciseTimer },
    })),
  setWarmupTimer: (warmupTimer: number | null) =>
    set((state) => ({
      ...state,
      workoutExercise: { ...state.workoutExercise!, warmup_timer: warmupTimer },
    })),
}));

export default useExerciseOptionsModal;
