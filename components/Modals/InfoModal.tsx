import { AppColors } from "@/constants/colors";
import useInfoModal from "@/store/useInfoModal";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Pressable,
} from "react-native";

export default function InfoModal() {
  const { isVisible, closeModal, title, subtitle } = useInfoModal();
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
        <Pressable onPress={closeModal} style={styles.button}>
          <Text style={styles.buttonText}>Got it!</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: AppColors.semiTransparent,
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
    backgroundColor: AppColors.white,
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
    color: AppColors.darkGray,
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    backgroundColor: AppColors.gray,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
