import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  Icon: any;
  cb: () => void;
  rightSide?: any;
  isActive?: boolean;
};

const ModalOptionButton = ({ title, Icon, cb, rightSide, isActive }: Props) => {
  return (
    <Pressable
      style={[
        styles.pressableButton,
        { backgroundColor: isActive ? "#2E3C49" : "transparent" },
      ]}
      onPress={cb}
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
    color: "white",
  },
});

export default ModalOptionButton;
