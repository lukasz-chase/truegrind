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
import { useState } from "react";
import { useRouter } from "expo-router";
import useActionModal from "@/store/useActionModal";

const MODAL_WIDTH = 170;

const WorkoutOptionsModal = function ExerciseOptionsModal() {
  const [shouldOpenActionModal, setShouldOpenActionModal] = useState(false);

  const { isVisible, closeModal, workoutProps } = useWorkoutOptionsModal();
  const { buttonRef, workout } = workoutProps;
  const { refetchData } = useAppStore();
  const { user } = userStore();
  const router = useRouter();
  const { openModal: openActionModal } = useActionModal();
  const deleteWorkoutHandler = async () => {
    await deleteWorkout(workout!.id);
    refetchData();
    closeModal();
    setShouldOpenActionModal(false);
  };
  const copyWorkoutHandler = async () => {
    await copyWorkout(workout!, user!.id);
    refetchData();
    closeModal();
  };
  const editTemplateHandler = () => {
    router.push(`/template/${workout?.id}`);
    closeModal();
  };
  const openActionModalHandler = () => {
    openActionModal({
      title: "Delete Workout",
      subtitle: `Are you sure you want to delete ${workout?.name}?`,
      onProceed: deleteWorkoutHandler,
    });
    closeModal();
  };
  const options = [
    {
      Icon: <AntDesign name="copy1" size={24} color={AppColors.white} />,
      title: "Copy",
      cb: copyWorkoutHandler,
      conditionToDisplay: workout?.user_id !== user?.id,
    },
    {
      Icon: <EvilIcons name="pencil" size={24} color={AppColors.blue} />,
      title: "Edit template",
      cb: editTemplateHandler,
      conditionToDisplay: workout?.user_id === user?.id,
    },
    {
      Icon: <EvilIcons name="close" size={24} color={AppColors.red} />,
      title: "Delete",
      cb: openActionModalHandler,
      conditionToDisplay: workout?.user_id === user?.id,
    },
  ];

  return (
    <AnchoredModal
      isVisible={isVisible}
      closeModal={closeModal}
      anchorRef={buttonRef}
      anchorCorner="RIGHT"
      backgroundColor={AppColors.darkBlue}
      modalWidth={MODAL_WIDTH}
    >
      <View style={styles.wrapper}>
        {options.map((option) => {
          if (option.conditionToDisplay) {
            return <ModalOptionButton key={option.title} {...option} />;
          }
        })}
      </View>
    </AnchoredModal>
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
