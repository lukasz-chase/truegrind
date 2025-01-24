import { Split } from "@/types/split";
import { create } from "zustand";

type Store = {
  splits: Split[];
  setSplits: (splits: Split[]) => void;
  removeSplit: (splitId: string) => void;
  addSplit: (split: Split) => void;
};

const useSplitsStore = create<Store>((set) => ({
  splits: [],
  setSplits: (splits) => set({ splits }),
  removeSplit: (splitId) =>
    set((state) => ({
      splits: state.splits.filter((split) => split.id !== splitId),
    })),
  addSplit: (split) => set((state) => ({ splits: [...state.splits, split] })),
}));

export default useSplitsStore;
