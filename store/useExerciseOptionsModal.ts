import { WorkoutExercisePopulated } from "@/types/workoutExercise";
import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (
    buttonRef: React.MutableRefObject<null>,
    workoutExercise: WorkoutExercisePopulated
  ) => void;
  closeModal: () => void;
  workoutExercise: null | WorkoutExercisePopulated;
  buttonRef: null | React.MutableRefObject<null>;
  setExerciseTimer: (exerciseTimer: number | null) => void;
  setWarmupTimer: (warmupTimer: number | null) => void;
}

const useExerciseOptionsModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (buttonRef, workoutExercise) =>
    set({ isVisible: true, buttonRef, workoutExercise }),
  closeModal: () => set({ isVisible: false }),
  workoutExercise: null,
  buttonRef: null,
  setExerciseTimer: (exerciseTimer: number | null) =>
    set((state) => ({
      ...state,
      exercise: { ...state.workoutExercise, timer: exerciseTimer },
    })),
  setWarmupTimer: (warmupTimer: number | null) =>
    set((state) => ({
      ...state,
      exercise: { ...state.workoutExercise, warmup_timer: warmupTimer },
    })),
}));

export default useExerciseOptionsModal;
