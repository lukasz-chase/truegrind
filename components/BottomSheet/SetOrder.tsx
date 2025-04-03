import { AppColors } from "@/constants/colors";
import useSetOptionsModal from "@/store/useSetOptionsModal";
import { useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  isCompleted: boolean;
  isWarmup: boolean;
  isDropset: boolean;
  order: number;
  exerciseId: string;
  exerciseSetId: string;
};

const SetOrder = ({
  isCompleted,
  isWarmup,
  isDropset,
  order,
  exerciseId,
  exerciseSetId,
}: Props) => {
  const { openModal } = useSetOptionsModal();

  const buttonRef = useRef(null);

  const getData = () => {
    if (isWarmup) {
      return {
        backgroundColor: AppColors.lightOrange,
        color: AppColors.orange,
        text: "W",
      };
    }
    if (isDropset) {
      return {
        backgroundColor: AppColors.lightPurple,
        color: AppColors.purple,
        text: "D",
      };
    }
    if (isCompleted) {
      return {
        backgroundColor: AppColors.lightGreen,
        color: AppColors.black,
        text: order,
      };
    }
    return {
      backgroundColor: AppColors.gray,
      color: AppColors.black,
      text: order,
    };
  };
  return (
    <Pressable
      style={[
        styles.rowButton,
        {
          backgroundColor: getData().backgroundColor,
        },
      ]}
      onPress={() => openModal({ exerciseId, exerciseSetId, buttonRef })}
      ref={buttonRef}
    >
      <Text style={[styles.rowButtonText, { color: getData().color }]}>
        {getData().text}
      </Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  rowButton: {
    backgroundColor: AppColors.gray,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 35,
  },
  rowButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SetOrder;
