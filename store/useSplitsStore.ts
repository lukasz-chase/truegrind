import { Split } from "@/types/split";
import { create } from "zustand";

type Store = {
  activeSplit: Split | null;
  setActiveSplit: (split: Split) => void;
};

const useSplitStore = create<Store>((set) => ({
  activeSplit: null,
  setActiveSplit: (split: Split) => set({ activeSplit: split }),
}));

export default useSplitStore;
