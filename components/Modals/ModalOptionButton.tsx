import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { AppColors } from "@/constants/colors";

type Props = {
  title: string;
  Icon: any;
  cb: () => void;
  rightSide?: any;
  isActive?: boolean;
};

const ModalOptionButton = ({ title, Icon, cb, rightSide, isActive }: Props) => {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    cb();
  };
  return (
    <Pressable
      style={[
        styles.pressableButton,
        {
          backgroundColor: isActive ? AppColors.blue : "transparent",
        },
      ]}
      onPress={handlePress}
    >
      {Icon}
      <Text style={styles.pressableText}>{title}</Text>
      {rightSide && rightSide}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  pressableButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pressableText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.white,
  },
});

export default ModalOptionButton;
