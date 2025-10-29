import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exerciseProps: ModalState["props"]) => void;
  closeModal: () => void;
  props: {
    folderId: string | null;
    buttonRef: React.MutableRefObject<null>;
    folderName: string | null;
    startAnEmptyWorkout: (folderId: string) => void;
  };
}

const useFolderOptionsModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (props: ModalState["props"]) => set({ isVisible: true, props }),
  closeModal: () => set({ isVisible: false }),
  props: {
    folderId: null,
    buttonRef: { current: null },
    folderName: null,
    startAnEmptyWorkout: () => {},
  },
}));

export default useFolderOptionsModal;
