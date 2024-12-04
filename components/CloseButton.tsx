import { AppColors } from "@/constants/colors";
import { EvilIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

const CloseButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable style={styles.modalCloseButton} onPress={onPress}>
      <EvilIcons name="close" size={24} color="black" />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  modalCloseButton: {
    backgroundColor: AppColors.gray,
    padding: 4,
    borderRadius: 8,
  },
});
export default CloseButton;
