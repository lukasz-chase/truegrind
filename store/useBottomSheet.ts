import { create } from "zustand";
import { Workout } from "@/types/workout";

interface BottomSheetStore {
  isSheetVisible: boolean;
  activeWorkout: Workout;
  setIsSheetVisible: (value: boolean) => void;
  setActiveWorkout: (workout: Workout) => void;
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => void;
}

const useBottomSheet = create<BottomSheetStore>((set, get) => ({
  isSheetVisible: false,
  activeWorkout: {
    id: 0,
    name: "New workout",
    user_id: "0",
  },
  setIsSheetVisible: (value: boolean) => set({ isSheetVisible: value }),
  setActiveWorkout: (workout: Workout) => set({ activeWorkout: workout }),
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => {
    const oldWorkout = get().activeWorkout;
    set({ activeWorkout: { ...oldWorkout, [field]: updatedValue } });
  },
}));

export default useBottomSheet;
