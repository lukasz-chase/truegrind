import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
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
  keyboardView: KeyboardView;
  inputOrder: string[];
  inputHandlers: { [key: string]: (value: string) => void };
  hasCustomTimer: boolean;
  isSetCompleted: boolean;
  setKeyboardView: (view: KeyboardView) => void;
  openKeyboard: () => void;
  updateInputProps: (
    inputId: string,
    setValueHandler: (value: string) => void,
    updateSet: (newValue: Partial<ExerciseSet>) => void,
    completeSet: () => void,
    isSetCompleted: boolean,
    hasCustomTimer?: boolean
  ) => void;
  closeKeyboard: () => void;
  addOne: () => void;
  removeOne: () => void;
  onKeyPress: (value: string) => void;
  setValueHandler: (value: string) => void;
  onDelete: () => void;
  addDot: () => void;
  setRPE: (rpe: { value: number; label: string }) => void;
  setPartials: (value: number | null) => void;
  updateSet: (newValue: any, name: keyof ExerciseSet) => void;
  registerInput: (id: string, setValueHandler: (value: string) => void) => void;
  focusNextInput: () => void;
  completeSet: () => void;
}

const useCustomKeyboard = create<KeyboardState>((set, get) => ({
  isVisible: false,
  activeField: null,
  updatedValue: "",
  selectedRPE: defaultRPE,
  keyboardView: KeyboardViewEnum.DEFAULT,
  partials: null,
  inputOrder: [],
  inputHandlers: {},
  hasCustomTimer: false,
  isSetCompleted: false,
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
  setRPE: (value) => {
    set((state) => {
      state.updateSet(value, "rpe");
      return {
        ...state,
        selectedRPE: value,
      };
    });
  },
  openKeyboard: () =>
    set((state) => {
      return {
        ...state,
        isVisible: true,
        updatedValue: "",
        keyboardView: "default",
        partials: null,
        selectedRPE: defaultRPE,
      };
    }),
  updateInputProps: (
    inputId,
    setValueHandler,
    updateSet,
    completeSet,
    isSetCompleted,
    hasCustomTimer = false
  ) => {
    set((state) => ({
      ...state,
      setValueHandler,
      activeField: inputId,
      updateSet,
      hasCustomTimer,
      completeSet,
      isSetCompleted,
    }));
  },
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
  updateSet: () => {},
  completeSet: () => {},
  registerInput: (id, setValueHandler) => {
    const { inputOrder, inputHandlers } = get();
    if (!inputOrder.includes(id)) {
      set({
        inputOrder: [...inputOrder, id],
        inputHandlers: { ...inputHandlers, [id]: setValueHandler },
      });
    }
  },
  focusNextInput: () => {
    const {
      activeField,
      inputOrder,
      inputHandlers,
      hasCustomTimer,
      closeKeyboard,
      completeSet,
      isSetCompleted,
    } = get();
    if (!activeField) return;
    const isRepsInput = activeField.search("reps") !== -1;
    if (isRepsInput && hasCustomTimer && !isSetCompleted) {
      if (hasCustomTimer) {
        completeSet();
      }
      closeKeyboard();
      return;
    }
    const currentIndex = inputOrder.indexOf(activeField);
    if (currentIndex !== -1 && currentIndex < inputOrder.length - 1) {
      const nextField = inputOrder[currentIndex + 1];
      const nextHandler = inputHandlers[nextField];
      set({
        activeField: nextField,
        updatedValue: "",
        setValueHandler: nextHandler,
      });
    }
  },
}));

export default useCustomKeyboard;
