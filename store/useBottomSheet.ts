import { create } from "zustand";
import { SharedValue } from "react-native-reanimated";

interface BottomSheetStore {
  sheetIndex: number;
}

const useBottomSheet = create<BottomSheetStore>((set) => ({
  sheetIndex: 0,
}));

export default useBottomSheet;
