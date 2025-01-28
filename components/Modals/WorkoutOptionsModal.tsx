import { StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";
import AnchoredModal from "./AnchoredModal";
import ModalOptionButton from "./ModalOptionButton";
import { EvilIcons } from "@expo/vector-icons";
import useWorkoutOptionsModal from "@/store/useWorkoutOptionsModal";
import useAppStore from "@/store/useAppStore";
import { copyWorkout, deleteWorkout } from "@/lib/workoutServices";
import userStore from "@/store/userStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import WarningModal from "../Modals/WarningModal";
import { useState } from "react";

const MODAL_WIDTH = 150;

const WorkoutOptionsModal = function ExerciseOptionsModal() {
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);

  const { isVisible, closeModal, workoutProps } = useWorkoutOptionsModal();
  const { buttonRef, workout } = workoutProps;
  const { refetchData } = useAppStore();
  const { user } = userStore();
  const deleteWorkoutHandler = async () => {
    await deleteWorkout(workout!.id);
    refetchData();
    closeModal();
    setIsWarningModalVisible(false);
    setOpenWarningModal(false);
  };
  const copyWorkoutHandler = async () => {
    await copyWorkout(workout!, user!.id);
    refetchData();
    closeModal();
  };
  const openWarningModalHandler = () => {
    setOpenWarningModal(true);
    closeModal();
  };
  const options = [
    {
      Icon: <AntDesign name="copy1" size={24} color="white" />,
      title: "Copy",
      cb: copyWorkoutHandler,
      conditionToDisplay: workout?.user_id !== user?.id,
    },
    {
      Icon: <EvilIcons name="close" size={24} color="red" />,
      title: "Delete",
      cb: openWarningModalHandler,
      conditionToDisplay: workout?.user_id === user?.id,
    },
  ];

  return (
    <>
      <AnchoredModal
        isVisible={isVisible}
        closeModal={closeModal}
        anchorRef={buttonRef}
        anchorCorner="RIGHT"
        backgroundColor={AppColors.darkBlue}
        modalWidth={MODAL_WIDTH}
        onDismiss={() => {
          if (openWarningModal) {
            setOpenWarningModal(false);
            setIsWarningModalVisible(true);
          }
        }}
      >
        <View style={styles.wrapper}>
          {options.map((option) => {
            if (option.conditionToDisplay) {
              return <ModalOptionButton key={option.title} {...option} />;
            }
          })}
        </View>
      </AnchoredModal>
      <WarningModal
        closeModal={() => setIsWarningModalVisible(false)}
        isVisible={isWarningModalVisible}
        title="Delete Workout"
        subtitle={`Are you sure you want to delete ${workout?.name}?`}
        onCancel={() => setIsWarningModalVisible(false)}
        onProceed={deleteWorkoutHandler}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  wrapper: {
    width: "100%",
  },
});

export default WorkoutOptionsModal;
