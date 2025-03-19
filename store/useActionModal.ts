import { defaultActionModalState } from "@/constants/actionModal";
import { create } from "zustand";

interface Props {
  title: string;
  subtitle: string;
  onCancel?: () => void;
  onProceed: () => void;
  proceedButtonLabeL?: string;
  proceedButtonBgColor?: string;
  cancelButtonLabel?: string;
  buttonsLayout?: "row" | "column";
}

interface ModalState {
  isVisible: boolean;
  openModal: (props: Props) => void;
  closeModal: () => void;
  props: Props;
}

const useActionModal = create<ModalState>((set, get) => ({
  isVisible: false,
  openModal: (props) => {
    set({ isVisible: true, props: { ...defaultActionModalState, ...props } });
  },
  closeModal: () => set({ isVisible: false }),
  props: defaultActionModalState,
}));

export default useActionModal;
