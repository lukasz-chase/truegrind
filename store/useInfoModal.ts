import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (title: string, subtitle: string) => void;
  closeModal: () => void;
  title: string;
  subtitle: string;
}

const useInfoModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (title, subtitle) => set({ isVisible: true, title, subtitle }),
  closeModal: () => set({ isVisible: false }),
  title: "",
  subtitle: "",
}));

export default useInfoModal;
