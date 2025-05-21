import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

type Props = {
  title: string;
  Icon: any;
  cb: () => void;
  rightSide?: any;
  isActive?: boolean;
};

const ModalOptionButton = ({ title, Icon, cb, rightSide, isActive }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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
          backgroundColor: isActive ? theme.blue : "transparent",
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
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
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
      color: theme.white,
    },
  });

export default ModalOptionButton;
