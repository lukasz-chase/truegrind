import { create } from "zustand";
import { Workout } from "@/types/workout";

interface BottomSheetStore {
  isSheetVisible: boolean;
  activeWorkout: Workout | null;
  setIsSheetVisible: (value: boolean) => void;
  setActiveWorkout: (workout: Workout) => void;
}

const useBottomSheet = create<BottomSheetStore>((set) => ({
  isSheetVisible: false,
  activeWorkout: null,
  setIsSheetVisible: (value: boolean) => set({ isSheetVisible: value }),
  setActiveWorkout: (workout: Workout) => set({ activeWorkout: workout }),
}));

export default useBottomSheet;
