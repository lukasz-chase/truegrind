import { StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";
import AnchoredModal from "./AnchoredModal";
import ModalOptionButton from "./ModalOptionButton";
import { EvilIcons } from "@expo/vector-icons";
import useWorkoutOptionsModal from "@/store/useWorkoutOptionsModal";
import useAppStore from "@/store/useAppStore";
import { deleteWorkout } from "@/lib/workoutServices";

const MODAL_WIDTH = 150;

const WorkoutOptionsModal = function ExerciseOptionsModal() {
  const { isVisible, closeModal, workoutProps } = useWorkoutOptionsModal();
  const { buttonRef, workoutId } = workoutProps;
  const { refetchData } = useAppStore();
  const deleteWorkoutHandler = () => {
    deleteWorkout(workoutId);
    refetchData();
    closeModal();
  };
  const options = [
    {
      Icon: <EvilIcons name="close" size={24} color="red" />,
      title: "Delete",
      cb: deleteWorkoutHandler,
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
        {options.map((option) => (
          <ModalOptionButton key={option.title} {...option} />
        ))}
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
