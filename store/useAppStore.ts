import { create } from "zustand";

type Store = {
  refetchWorkouts: number;
  refetchUpcomingWorkout: number;
  setRefetchUpcomingWorkout: () => void;
  setRefetchWorkouts: () => void;
};

const useAppStore = create<Store>((set) => ({
  refetchWorkouts: 0,
  refetchUpcomingWorkout: 0,
  setRefetchWorkouts: () =>
    set((state) => ({ refetchWorkouts: state.refetchWorkouts + 1 })),
  setRefetchUpcomingWorkout: () =>
    set((state) => ({
      refetchUpcomingWorkout: state.refetchUpcomingWorkout + 1,
    })),
}));

export default useAppStore;
