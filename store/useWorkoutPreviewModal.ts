import { Workout } from "@/types/workout";
import { create } from "zustand";
import useActiveWorkout from "./useActiveWorkout";
import useBottomSheet from "./useBottomSheet";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

interface ModalState {
  isVisible: boolean;
  openModal: (workout: Workout) => void;
  closeModal: () => void;
  workout: Workout | null;
  startWorkout: () => void;
}

const useWorkoutPreviewModal = create<ModalState>((set, get) => ({
  isVisible: false,
  workout: null,

  openModal: (workout) => {
    set({
      isVisible: true,
      workout,
    });
  },
  closeModal: () => set({ isVisible: false }),
  startWorkout: () => {
    const workout = get().workout;
    if (!workout) return;

    // pull in actions from the other stores by calling getState()
    const { setActiveWorkout, setIsNewWorkout } = useActiveWorkout.getState();
    const { setIsSheetVisible } = useBottomSheet.getState();

    // run them
    setIsNewWorkout(false);
    set({ isVisible: false });
    setIsSheetVisible(true);
    setActiveWorkout(workout, true);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
}));

export default useWorkoutPreviewModal;
