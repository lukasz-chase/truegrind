import React from "react";
import AnchoredModal from "./AnchoredModal";
import { AppColors } from "@/constants/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  anchorCorner: "RIGHT" | "LEFT";
  anchorRef: React.MutableRefObject<null>;
  isVisible: boolean;
  closeModal: () => void;
  data: { label: string; value: string }[];
  onPress: (value: string) => void;
  value: string;
};

const ExerciseFiltersModal = ({
  anchorCorner,
  anchorRef,
  closeModal,
  isVisible,
  data,
  onPress,
  value,
}: Props) => {
  return (
    <AnchoredModal
      anchorCorner={anchorCorner}
      anchorRef={anchorRef}
      closeModal={closeModal}
      isVisible={isVisible}
      backgroundColor={AppColors.darkBlue}
      modalWidth={200}
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
                  value === filterOption.value ? AppColors.blue : "transparent",
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

const styles = StyleSheet.create({
  filterOption: {
    padding: 10,
    marginHorizontal: -10,
  },
  filterOptionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },
});

export default ExerciseFiltersModal;
