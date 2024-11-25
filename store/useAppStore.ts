import { create } from "zustand";

type Store = {
  refetchNumber: number;
  refetchData: () => void;
};

const useAppStore = create<Store>((set) => ({
  refetchNumber: 0,
  refetchData: () =>
    set((state) => ({ refetchNumber: state.refetchNumber + 1 })),
}));

export default useAppStore;
