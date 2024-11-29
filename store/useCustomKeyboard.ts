import { create } from "zustand";

interface KeyboardState {
  isVisible: boolean;
  activeField: string | null;
  updatedValue: string;
  openKeyboard: (
    inputId: string,
    setValueHandler: (value: string) => void
  ) => void;
  closeKeyboard: () => void;
  addOne: () => void;
  removeOne: () => void;
  onKeyPress: (value: string) => void;
  setValueHandler: (value: string) => void;
  onDelete: () => void;
  addDot: () => void;
}

const useCustomKeyboard = create<KeyboardState>((set) => ({
  isVisible: false,
  activeField: null,
  updatedValue: "",
  openKeyboard: (inputId, setValueHandler) =>
    set((state) => {
      return {
        ...state,
        isVisible: true,
        setValueHandler,
        activeField: inputId,
        updatedValue: "",
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
}));

export default useCustomKeyboard;
