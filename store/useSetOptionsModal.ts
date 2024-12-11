import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exerciseProps: ModalState["setProps"]) => void;
  closeModal: () => void;
  setProps: {
    exerciseId: string;
    exerciseSetId: string;
    buttonRef: React.MutableRefObject<null>;
  };
}

const useSetOptionsModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (setProps: ModalState["setProps"]) =>
    set({ isVisible: true, setProps }),
  closeModal: () => set({ isVisible: false }),
  setProps: {
    exerciseId: "",
    exerciseSetId: "",
    buttonRef: { current: null },
  },
}));

export default useSetOptionsModal;
