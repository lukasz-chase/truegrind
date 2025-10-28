import { BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { create } from "zustand";

interface BottomSheetStore {
  isSheetVisible: boolean;
  setIsSheetVisible: (value: boolean) => void;
  bottomSheetScrollViewRef: RefObject<BottomSheetScrollViewMethods | null> | null;
  setBottomSheetScrollViewRef: (
    value: RefObject<BottomSheetScrollViewMethods | null>
  ) => void;
}

const useBottomSheet = create<BottomSheetStore>((set, get) => ({
  isSheetVisible: false,
  setIsSheetVisible: (value: boolean) => set({ isSheetVisible: value }),
  bottomSheetScrollViewRef: null,
  setBottomSheetScrollViewRef: (bottomSheetScrollViewRef) =>
    set({ bottomSheetScrollViewRef }),
}));

export default useBottomSheet;
