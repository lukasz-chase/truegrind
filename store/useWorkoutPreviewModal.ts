import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useWorkoutPreviewModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: () => set({ isVisible: true }),
  closeModal: () => set({ isVisible: false }),
}));

export default useWorkoutPreviewModal;
