import { create } from "zustand";

type Store = {
  refetchWorkouts: number;
  refetchProfileData: number;
  setRefetchProfileData: () => void;
  setRefetchWorkouts: () => void;
};

const useAppStore = create<Store>((set) => ({
  refetchWorkouts: 0,
  refetchProfileData: 0,
  setRefetchWorkouts: () =>
    set((state) => ({ refetchWorkouts: state.refetchWorkouts + 1 })),
  setRefetchProfileData: () =>
    set((state) => ({
      refetchProfileData: state.refetchProfileData + 1,
    })),
}));

export default useAppStore;
