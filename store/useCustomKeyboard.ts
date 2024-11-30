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
  keyboardView: "default" | "rpe" | "partials";
  setKeyboardView: (view: "default" | "rpe" | "partials") => void;
  openKeyboard: (
    inputId: string,
    setValueHandler: (value: string) => void,
    handleRPE: (value: number | null) => void
  ) => void;
  closeKeyboard: () => void;
  addOne: () => void;
  removeOne: () => void;
  onKeyPress: (value: string) => void;
  setValueHandler: (value: string) => void;
  onDelete: () => void;
  addDot: () => void;
  handleRPE: (value: number | null) => void;
  selectRPE: (rpe: { value: number; label: string }) => void;
}

const useCustomKeyboard = create<KeyboardState>((set) => ({
  isVisible: false,
  activeField: null,
  updatedValue: "",
  selectedRPE: defaultRPE,
  keyboardView: "default",
  handleRPE: () => {},
  setKeyboardView: (view) => set({ keyboardView: view }),
  openKeyboard: (inputId, setValueHandler, handleRPE) =>
    set((state) => {
      return {
        ...state,
        isVisible: true,
        setValueHandler,
        activeField: inputId,
        updatedValue: "",
        handleRPE,
        keyboardView: "default",
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
        state.handleRPE(defaultRPE.value);
        return {
          ...state,
          selectedRPE: defaultRPE,
        };
      }
      state.handleRPE(rpe.value);
      return {
        ...state,
        selectedRPE: rpe,
      };
    });
  },
}));

export default useCustomKeyboard;
