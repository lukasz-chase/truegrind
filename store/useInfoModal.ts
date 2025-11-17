import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (content: { title: string; description: string }) => void;
  closeModal: () => void;
  content: {
    title: string;
    description: string;
  };
}

const useInfoModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (content) => set({ isVisible: true, content }),
  closeModal: () => set({ isVisible: false }),
  content: {
    title: "",
    description: "",
  },
}));

export default useInfoModal;
