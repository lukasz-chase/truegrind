import { AppColors } from "@/constants/colors";
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
    const currentProps = get().props;
    set({ isVisible: true, props: { ...currentProps, ...props } });
  },
  closeModal: () => set({ isVisible: false }),
  props: {
    title: "",
    subtitle: "",
    onCancel: () => {},
    onProceed: () => {},
    proceedButtonLabeL: "Delete",
    proceedButtonBgColor: AppColors.red,
    cancelButtonLabel: "Cancel",
    buttonsLayout: "row",
  },
}));

export default useActionModal;
