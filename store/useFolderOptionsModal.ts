import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (exerciseProps: ModalState["props"]) => void;
  closeModal: () => void;
  props: {
    folderId: string | null;
    buttonRef: React.MutableRefObject<null>;
    folderName: string | null;
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
  },
}));

export default useFolderOptionsModal;
