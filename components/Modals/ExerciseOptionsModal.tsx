import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/colors";
import RemoveExerciseModal from "./RemoveExerciseModal";
import { useState } from "react";

type Props = {
  exerciseId: string;
  exerciseName: string;
  buttonPosition: {
    fx: number;
    fy: number;
    width: number;
    height: number;
  };
  isVisible: boolean;
  closeModal: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExerciseOptionsModal = function ExerciseOptionsModal({
  exerciseId,
  exerciseName,
  buttonPosition,
  closeModal,
  isVisible,
  setIsVisible,
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
  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={closeModal}
        onDismiss={() => {
          if (openWarning) setIsWarningVisible(true);
        }}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  {
                    position: "absolute",
                    top: buttonPosition.fy, // Position below the button
                    left: buttonPosition.fx - 200 + buttonPosition.width,
                  },
                ]}
              >
                {options.map(({ title, Icon, cb }) => {
                  return (
                    <Pressable
                      key={title}
                      style={styles.pressableButton}
                      onPress={cb}
                    >
                      {Icon}
                      <Text style={styles.pressableText}>{title}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // padding outside the modal
  },
  modalContent: {
    width: 200, // Adjust width as needed
    height: "auto",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: AppColors.darkBlue,
  },
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
