import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  buttonRef: React.MutableRefObject<null>;
  setButtonRef: (buttonRef: React.MutableRefObject<null>) => void;
}

const useWorkoutTimerModal = create<ModalState>((set) => ({
  isVisible: false,
  buttonRef: { current: null },
  openModal: () => set({ isVisible: true }),
  setButtonRef: (buttonRef: React.MutableRefObject<null>) => set({ buttonRef }),
  closeModal: () => set({ isVisible: false }),
}));

export default useWorkoutTimerModal;
