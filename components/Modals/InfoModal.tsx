import useInfoModal from "@/store/useInfoModal";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Pressable,
} from "react-native";

export default function InfoModal() {
  const { isVisible, closeModal, content } = useInfoModal();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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

      {content && (
        <View style={styles.modalContent}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.description}>{content.description}</Text>
          <Pressable onPress={closeModal} style={styles.button}>
            <Text style={styles.buttonText}>Got it!</Text>
          </Pressable>
        </View>
      )}
    </Modal>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      backgroundColor: theme.semiTransparent,
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
      backgroundColor: theme.background,
      gap: 20,
      margin: "auto",
    },
    title: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    description: {
      textAlign: "center",
      fontSize: 16,
      color: theme.textColor,
      fontWeight: "500",
    },
    button: {
      width: "100%",
      padding: 10,
      alignItems: "center",
      backgroundColor: theme.black,
      borderRadius: 10,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.white,
    },
  });
