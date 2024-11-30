import { ExerciseSet } from "@/types/exercisesSets";
import { create } from "zustand";

const defaultRPE = {
  value: null,
  label:
    "RPE is a way to measure the difficulty of a set. Tap a number to select an RPE value.",
};

interface KeyboardState {
  isVisible: boolean;
  activeField: string | null;
  updatedValue: string;
  selectedRPE: { value: number | null; label: string };
  partials: number | null;
  keyboardView: "default" | "RPE" | "partials";
  setKeyboardView: (view: "default" | "RPE" | "partials") => void;
  openKeyboard: (
    inputId: string,
    setValueHandler: (value: string) => void,
    setRPELocallyAndInStore: (value: number | null) => void,
    updateSet: (newValue: any, name: keyof ExerciseSet) => void
  ) => void;
  closeKeyboard: () => void;
  addOne: () => void;
  removeOne: () => void;
  onKeyPress: (value: string) => void;
  setValueHandler: (value: string) => void;
  onDelete: () => void;
  addDot: () => void;
  setRPELocallyAndInStore: (value: number | null) => void;
  selectRPE: (rpe: { value: number; label: string }) => void;
  setPartials: (value: number | null) => void;
  updateSet: (newValue: any, name: keyof ExerciseSet) => void;
  setRPEInStore: (rpe: { value: number; label: string }) => void;
}

const useCustomKeyboard = create<KeyboardState>((set) => ({
  isVisible: false,
  activeField: null,
  updatedValue: "",
  selectedRPE: defaultRPE,
  keyboardView: "default",
  partials: null,
  setRPELocallyAndInStore: () => {},
  setKeyboardView: (view) => set({ keyboardView: view }),
  setPartials: (value) => {
    set((state) => {
      state.updateSet(value, "partials");
      return {
        ...state,
        partials: value,
      };
    });
  },
  openKeyboard: (
    inputId,
    setValueHandler,
    setRPELocallyAndInStore,
    updateSet
  ) =>
    set((state) => {
      return {
        ...state,
        isVisible: true,
        setValueHandler,
        activeField: inputId,
        updatedValue: "",
        setRPELocallyAndInStore,
        keyboardView: "default",
        updateSet,
        partials: null,
      };
    }),
  closeKeyboard: () => set({ isVisible: false, activeField: null }),
  setValueHandler: () => {},
  onKeyPress: (value: string) => {
    set((state) => {
      if (state.updatedValue.split("").length > 4) return state;
      const updatedValue = state.updatedValue
        ? `${state.updatedValue}${value}`
        : value;
      state.setValueHandler(updatedValue);

      return {
        ...state,
        updatedValue,
      };
    });
  },
  onDelete: () => {
    set((state) => {
      const updatedValue = state.updatedValue.slice(0, -1);
      state.setValueHandler(updatedValue);
      return {
        ...state,
        updatedValue,
      };
    });
  },
  addOne: () => {
    set((state) => {
      const updatedValue = `${Number(state.updatedValue) + 1}`;
      state.setValueHandler(updatedValue);
      return {
        ...state,
        updatedValue,
      };
    });
  },
  removeOne: () => {
    set((state) => {
      const updatedValue = `${Number(state.updatedValue) - 1}`;
      state.setValueHandler(updatedValue);
      return {
        ...state,
        updatedValue,
      };
    });
  },
  addDot: () => {
    set((state) => {
      const updatedValue = `${state.updatedValue}.`;
      state.setValueHandler(updatedValue);
      return {
        ...state,
        updatedValue,
      };
    });
  },
  selectRPE: (rpe: { value: number; label: string }) => {
    set((state) => {
      if (rpe.value === state.selectedRPE.value) {
        state.setRPELocallyAndInStore(defaultRPE.value);
        return {
          ...state,
          selectedRPE: defaultRPE,
        };
      }
      state.setRPELocallyAndInStore(rpe.value);
      return {
        ...state,
        selectedRPE: rpe,
      };
    });
  },
  setRPEInStore: (rpe: { value: number; label: string }) => {
    set((state) => {
      return {
        ...state,
        selectedRPE: rpe,
      };
    });
  },
  updateSet: () => {},
}));

export default useCustomKeyboard;
