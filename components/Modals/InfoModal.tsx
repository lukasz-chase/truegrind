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
  const { isVisible, closeModal, title, subtitle } = useInfoModal();
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
      backgroundColor: theme.white,
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
      color: theme.darkGray,
      fontWeight: "500",
    },
    button: {
      width: "100%",
      padding: 10,
      alignItems: "center",
      backgroundColor: theme.gray,
      borderRadius: 10,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
