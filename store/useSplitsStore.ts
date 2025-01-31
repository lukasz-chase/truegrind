import { Split, SplitPopulated } from "@/types/split";
import { create } from "zustand";

type Store = {
  splits: Split[];
  setSplits: (splits: Split[]) => void;
  removeSplit: (splitId: string) => void;
  addSplit: (split: Split) => void;
  activeSplit: SplitPopulated | null;
  setActiveSplit: (split: SplitPopulated) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useSplitsStore = create<Store>((set) => ({
  splits: [],
  setSplits: (splits) => set({ splits }),
  removeSplit: (splitId) =>
    set((state) => ({
      splits: state.splits.filter((split) => split.id !== splitId),
    })),
  addSplit: (split) => set((state) => ({ splits: [...state.splits, split] })),
  activeSplit: null,
  setActiveSplit: (split) => set({ activeSplit: split }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useSplitsStore;
