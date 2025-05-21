import React, { useMemo } from "react";
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
import useActionModal from "@/store/useActionModal";
import useThemeStore from "@/store/useThemeStore";
import { AppTheme, AppThemeEnum, ThemeColors } from "@/types/user";

export default function ActionModal() {
  const { props, closeModal, isVisible } = useActionModal();
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme, mode), [theme, mode]);
  const {
    onCancel,
    onProceed,
    subtitle,
    title,
    buttonsLayout,
    cancelButtonLabel,
    proceedButtonBgColor,
    proceedButtonLabeL,
  } = props;
  const onProceedHandler = () => {
    onProceed();
    closeModal();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const onCancelHandler = () => {
    if (onCancel) onCancel();
    closeModal();
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
            onPress={onCancelHandler}
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
            <Text style={[styles.buttonText, { color: theme.white }]}>
              {proceedButtonLabeL}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (theme: ThemeColors, mode: AppTheme) =>
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
    subtitle: {
      textAlign: "center",
      fontSize: 16,
      color: theme.textColor,
    },
    buttonsWrapper: {
      gap: 15,
      width: "100%",
    },
    button: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: mode === AppThemeEnum.DARK ? theme.black : theme.gray,
    },
    buttonText: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
  });
