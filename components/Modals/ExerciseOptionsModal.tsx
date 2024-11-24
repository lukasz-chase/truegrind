import { StyleSheet, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/colors";
import RemoveExerciseModal from "./RemoveExerciseModal";
import { useState } from "react";
import AnchoredModal from "./AnchoredModal";

type Props = {
  exerciseId: string;
  exerciseName: string;
  isVisible: boolean;
  closeModal: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.MutableRefObject<null>;
};

const ExerciseOptionsModal = function ExerciseOptionsModal({
  exerciseId,
  exerciseName,
  closeModal,
  isVisible,
  setIsVisible,
  buttonRef,
}: Props) {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const options = [
    {
      Icon: <EvilIcons name="pencil" size={24} color={AppColors.blue} />,
      title: "Add a Note",
      cb: () => setIsWarningVisible(true),
    },
    {
      Icon: (
        <MaterialCommunityIcons
          name="arrow-u-left-top"
          size={24}
          color={AppColors.blue}
        />
      ),
      title: "Replace Exercise",
      cb: () => setIsWarningVisible(true),
    },
    {
      Icon: <Ionicons name="timer-outline" size={24} color={AppColors.blue} />,
      title: "Auto Rest Timer",
      cb: () => setIsWarningVisible(true),
    },
    {
      Icon: <EvilIcons name="close" size={24} color={AppColors.red} />,
      title: "Remove Exercise",
      cb: () => {
        setOpenWarning(true);
        setIsVisible(false);
      },
    },
  ];
  const closeWarningModal = () => {
    setIsWarningVisible(false);
  };
  const onDismiss = () => {
    if (openWarning) setIsWarningVisible(true);
  };
  return (
    <>
      <AnchoredModal
        isVisible={isVisible}
        closeModal={closeModal}
        anchorRef={buttonRef}
        onDismiss={onDismiss}
        anchorCorner="RIGHT"
        backgroundColor={AppColors.darkBlue}
        modalWidth={200}
      >
        {options.map(({ title, Icon, cb }) => {
          return (
            <Pressable key={title} style={styles.pressableButton} onPress={cb}>
              {Icon}
              <Text style={styles.pressableText}>{title}</Text>
            </Pressable>
          );
        })}
      </AnchoredModal>
      <RemoveExerciseModal
        exerciseId={exerciseId}
        closeModal={closeWarningModal}
        isVisible={isWarningVisible}
        exerciseName={exerciseName}
      />
    </>
  );
};

const styles = StyleSheet.create({
  pressableButton: {
    width: "100%",
    paddingVertical: 12,
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

export default ExerciseOptionsModal;
