import { AppColors } from "@/constants/colors";
import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Platform,
} from "react-native";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  title: string;
  subtitle: string;
  onCancel: () => void;
  onProceed: () => void;
  proceedButtonLabeL?: string;
  proceedButtonBgColor?: string;
  cancelButtonLabel?: string;
  buttonsLayout?: "row" | "column";
};

export default function ActionModal({
  isVisible,
  closeModal,
  title,
  subtitle,
  onCancel,
  onProceed,
  proceedButtonLabeL = "Delete",
  proceedButtonBgColor = AppColors.red,
  cancelButtonLabel = "Cancel",
  buttonsLayout = "row",
}: Props) {
  const onProceedHandler = () => {
    onProceed();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={[styles.buttonsWrapper, { flexDirection: buttonsLayout }]}>
          <Pressable
            style={[styles.button, buttonsLayout === "row" && { flex: 1 }]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>{cancelButtonLabel}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: proceedButtonBgColor },
              buttonsLayout === "row" && { flex: 1 },
            ]}
            onPress={onProceedHandler}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              {proceedButtonLabeL}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  modalContent: {
    width: "90%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    gap: 20,
    margin: "auto",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
  },
  buttonsWrapper: {
    gap: 15,
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: AppColors.gray,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
