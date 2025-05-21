import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import React, { useMemo } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Pressable } from "react-native";

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  onPress: (value: boolean) => void;
};

export default function TemplateModal({
  isVisible,
  closeModal,
  onPress,
}: Props) {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const closeModalHandler = () => {
    closeModal();
    onPress(false);
  };
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModalHandler}
    >
      <TouchableWithoutFeedback onPress={closeModalHandler}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.title}>Update Template</Text>
        <Text style={styles.subtitle}>
          You've made changes from your original template. Would you like to
          update it?
        </Text>
        <Pressable
          style={[styles.buttonWrapper, { backgroundColor: theme.blue }]}
          onPress={() => onPress(true)}
        >
          <Text style={styles.buttonText}>Update Template</Text>
        </Pressable>
        <Pressable style={styles.buttonWrapper} onPress={() => onPress(false)}>
          <Text style={styles.buttonText}>Keep Original Template</Text>
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
    },
    buttonWrapper: {
      paddingVertical: 20,
      borderRadius: 10,
      backgroundColor: theme.gray,
      width: "100%",
    },
    buttonText: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
      color: theme.black,
    },
  });
