import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import SelectOptionsModal from "./SelectOptionsModal";
import { SCREEN_WIDTH } from "@/constants/device";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

type Props = {
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<any>>;
  data: { label: string; value: string }[];
  buttonLabel: string;
  anchor: "LEFT" | "RIGHT";
  size?: "sm" | "lg";
};
const CustomSelect = ({
  data,
  selectedValue,
  setSelectedValue,
  buttonLabel,
  anchor,
  size = "sm",
}: Props) => {
  const buttonRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <>
      <Pressable
        style={[
          styles.dropdownButton,
          {
            backgroundColor: selectedValue ? theme.blue : theme.gray,
            width: size === "sm" ? "48%" : "100%",
            padding: size === "sm" ? 5 : 10,
          },
        ]}
        onPress={() => setModalVisible(true)}
        ref={buttonRef}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            { color: selectedValue ? theme.white : theme.textColor },
          ]}
        >
          {selectedValue || buttonLabel}
        </Text>
      </Pressable>
      <SelectOptionsModal
        data={data}
        anchorCorner={anchor}
        anchorRef={buttonRef}
        closeModal={() => setModalVisible(false)}
        isVisible={modalVisible}
        onPress={(equipment: string) => {
          if (selectedValue === equipment) setSelectedValue("");
          else setSelectedValue(equipment);
          setModalVisible(false);
        }}
        value={selectedValue}
        width={size === "sm" ? SCREEN_WIDTH * 0.48 : SCREEN_WIDTH * 0.9}
      />
    </>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    dropdownButton: {
      borderRadius: 8,
      alignItems: "center",
    },
    dropdownButtonText: {
      fontWeight: "bold",
      fontSize: 16,
    },
  });

export default CustomSelect;
