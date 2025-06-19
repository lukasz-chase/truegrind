import { BAR_TYPES } from "@/constants/keyboard";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import { ExerciseSet, BarTypeEnum } from "@/types/exercisesSets";
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
  selectedBarType: BarTypeEnum | null;
  currentValue: number | null;
  setKeyboardView: (view: KeyboardView) => void;
  openKeyboard: () => void;
  updateInputProps: (
    inputId: string,
    setValueHandler: (value: string) => void,
    updateSet: (newValue: Partial<ExerciseSet>) => void,
    completeSet: () => void,
    isSetCompleted: boolean,
    currentValue: number | null,
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
  updateSet: (newValue: Partial<ExerciseSet>) => void;
  registerInput: (id: string, setValueHandler: (value: string) => void) => void;
  unRegisterInput: (id: string) => void;
  focusNextInput: () => void;
  completeSet: () => void;
  setBarType: (barType: BarTypeEnum | null) => void;
}

const useCustomKeyboard = create<KeyboardState>((set, get) => ({
  currentValue: null,
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
  selectedBarType: null,
  setRPELocallyAndInStore: () => {},
  setKeyboardView: (view) => set({ keyboardView: view }),
  setPartials: (value) => {
    set((state) => {
      state.updateSet({ partials: value });
      return {
        ...state,
        partials: value,
      };
    });
  },
  setRPE: (rpe) => {
    set((state) => {
      state.updateSet({ rpe: rpe.value });
      return {
        ...state,
        selectedRPE: rpe,
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
        selectedBarType: null,
      };
    }),
  updateInputProps: (
    inputId,
    setValueHandler,
    updateSet,
    completeSet,
    isSetCompleted,
    currentValue,
    hasCustomTimer = false
  ) => {
    set((state) => ({
      ...state,
      setValueHandler,
      activeField: inputId,
      updateSet,
      hasCustomTimer,
      completeSet,
      currentValue,
      isSetCompleted,
    }));
  },
  closeKeyboard: () => set({ isVisible: false, activeField: null }),
  setValueHandler: () => {},
  onKeyPress: (value: string) => {
    set((state) => {
      if (state.updatedValue.split("").length > 5) return state;
      const updatedValue = state.updatedValue
        ? `${state.updatedValue}${value}`
        : value;
      state.setValueHandler(updatedValue);

      return {
        ...state,
        updatedValue,
        currentValue: Number(updatedValue),
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
        currentValue: Number(updatedValue),
      };
    });
  },
  addOne: () => {
    set((state) => {
      const value = state.currentValue ? state.currentValue : 0;
      const updatedValue = `${Number(value) + 1}`;
      state.setValueHandler(updatedValue);
      return {
        ...state,
        updatedValue,
        currentValue: Number(updatedValue),
      };
    });
  },
  removeOne: () => {
    set((state) => {
      const value = state.currentValue ? state.currentValue : 0;
      const updatedValue = `${Math.max(Number(value) - 1, 0)}`;
      state.setValueHandler(updatedValue);
      return {
        ...state,
        updatedValue,
        currentValue: Number(updatedValue),
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
  unRegisterInput: (id) => {
    const { inputOrder, inputHandlers } = get();
    set({
      inputOrder: inputOrder.filter((input) => input !== id),
      inputHandlers: Object.fromEntries(
        Object.entries(inputHandlers).filter(([key]) => key !== id)
      ),
    });
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
  setBarType: (barTypeName) => {
    set((state) => {
      state.updateSet({ bar_type: barTypeName });
      return {
        ...state,
        selectedBarType: barTypeName,
      };
    });
  },
}));

export default useCustomKeyboard;
