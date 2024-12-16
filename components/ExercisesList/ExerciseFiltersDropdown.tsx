import { AppColors } from "@/constants/colors";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import ExerciseFiltersModal from "../Modals/ExerciseFiltersModal";

type Props = {
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  data: { label: string; value: string }[];
  buttonLabel: string;
  anchor: "LEFT" | "RIGHT";
};
const ExerciseFiltersDropdown = ({
  data,
  selectedValue,
  setSelectedValue,
  buttonLabel,
  anchor,
}: Props) => {
  const buttonRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable
        style={[
          styles.dropdownButton,
          {
            backgroundColor: selectedValue ? AppColors.blue : AppColors.gray,
          },
        ]}
        onPress={() => setModalVisible(true)}
        ref={buttonRef}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            { color: selectedValue ? "white" : "black" },
          ]}
        >
          {selectedValue || buttonLabel}
        </Text>
      </Pressable>
      <ExerciseFiltersModal
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
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 5,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ExerciseFiltersDropdown;
