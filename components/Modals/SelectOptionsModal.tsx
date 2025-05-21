import React, { useMemo } from "react";
import AnchoredModal from "./AnchoredModal";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

type Props = {
  anchorCorner: "RIGHT" | "LEFT";
  anchorRef: React.MutableRefObject<null>;
  isVisible: boolean;
  closeModal: () => void;
  data: { label: string; value: string }[];
  onPress: (value: string) => void;
  value: string;
  width?: number;
};

const SelectOptionsModal = ({
  anchorCorner,
  anchorRef,
  closeModal,
  isVisible,
  data,
  onPress,
  value,
  width = 200,
}: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <AnchoredModal
      anchorCorner={anchorCorner}
      anchorRef={anchorRef}
      closeModal={closeModal}
      isVisible={isVisible}
      backgroundColor={theme.darkBlue}
      modalWidth={width}
    >
      <View style={{ gap: 10, width: "100%", alignSelf: "flex-start" }}>
        {data.map((filterOption) => (
          <Pressable
            key={filterOption.value}
            onPress={() => onPress(filterOption.value)}
            style={[
              styles.filterOption,
              {
                backgroundColor:
                  value === filterOption.value ? theme.blue : "transparent",
              },
            ]}
          >
            <Text style={styles.filterOptionText}>{filterOption.label}</Text>
          </Pressable>
        ))}
      </View>
    </AnchoredModal>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    filterOption: {
      padding: 10,
      marginHorizontal: -10,
    },
    filterOptionText: {
      color: theme.white,
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "left",
    },
  });

export default SelectOptionsModal;
