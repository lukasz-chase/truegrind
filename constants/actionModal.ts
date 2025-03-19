import { AppColors } from "./colors";

export const updateTemplate = {
  title: "Update Template",
  subtitle:
    "You've made changes from your original template. Would you like to update it?",
  proceedButtonLabeL: "Update Template",
  cancelButtonLabel: "Keep Original Template",
};
export const saveTemplate = {
  title: "Save as Template",
  subtitle:
    "Save this workout as a template so you can perform it again in the future.",
  proceedButtonLabeL: "Save as Template",
  cancelButtonLabel: "No thanks!",
};

export const defaultActionModalState = {
  title: "",
  subtitle: "",
  proceedButtonLabeL: "Delete",
  proceedButtonBgColor: AppColors.red,
  cancelButtonLabel: "Cancel",
  buttonsLayout: "row" as const,
  onCancel: () => {},
  onProceed: () => {},
};
