import { create } from "zustand";

type Store = {
  refetchData: number;
  setRefetchData: () => void;
};

const appStore = create<Store>((set) => ({
  refetchData: 0,
  setRefetchData: () =>
    set((state) => ({ refetchData: state.refetchData + 1 })),
}));

export default appStore;
