import { create } from "zustand";

interface ModalState {
  isVisible: boolean;
  openModal: (folder: ModalState["props"] | null) => void;
  closeModal: () => void;
  props: {
    folderId: string;
    folderName: string;
  } | null;
}

const useUpsertFolderModal = create<ModalState>((set) => ({
  isVisible: false,
  openModal: (props) => set({ isVisible: true, props }),
  closeModal: () => set({ isVisible: false }),
  props: null,
}));

export default useUpsertFolderModal;
