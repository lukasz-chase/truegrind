import { StyleSheet, Text, View } from "react-native";
import { AppColors } from "@/constants/colors";
import AnchoredModal from "./AnchoredModal";
import ModalOptionButton from "./ModalOptionButton";
import { AntDesign } from "@expo/vector-icons";
import useActiveWorkout from "@/store/useActiveWorkout";
import useSetOptionsModal from "@/store/useSetOptionsModal";
import { ExerciseSet } from "@/types/exercisesSets";
import { Pressable } from "react-native";

const MODAL_WIDTH = 275;

const SetOptionsModal = function ExerciseOptionsModal() {
  const { isVisible, closeModal, setProps } = useSetOptionsModal();
  const { buttonRef, exerciseId, exerciseSetId } = setProps;
  const { updateExerciseSet, activeWorkout } = useActiveWorkout();

  const currentSet = activeWorkout.workout_exercises
    ?.find((workout) => workout.exercises.id === exerciseId)
    ?.exercise_sets.find((set) => set.id === exerciseSetId);

  const updateSetHandler = (propertyToUpdate: keyof ExerciseSet) => {
    if (!currentSet) return;
    let warmupValue = currentSet.is_warmup;
    let dropSetValue = currentSet.is_dropset;
    if (propertyToUpdate === "is_warmup") {
      if (dropSetValue) dropSetValue = false;
      if (warmupValue) warmupValue = false;
      else warmupValue = true;
    } else {
      if (warmupValue) warmupValue = false;
      if (dropSetValue) dropSetValue = false;
      else dropSetValue = true;
    }

    updateExerciseSet(exerciseId, exerciseSetId, {
      is_warmup: warmupValue,
      is_dropset: dropSetValue,
    });
    closeModal();
  };
  const questionButton = (
    <Pressable style={styles.questionButton}>
      <AntDesign name="question" size={24} color={AppColors.white} />
    </Pressable>
  );

  const options = [
    {
      Icon: (
        <Text style={[styles.optionLetter, { color: AppColors.orange }]}>
          W
        </Text>
      ),
      title: "Warm Up",
      cb: () => updateSetHandler("is_warmup"),
      rightSide: questionButton,
      isActive: currentSet?.is_warmup,
    },
    {
      Icon: (
        <Text style={[styles.optionLetter, { color: AppColors.purple }]}>
          D
        </Text>
      ),
      title: "Drop Set",
      cb: () => updateSetHandler("is_dropset"),
      rightSide: questionButton,
      isActive: currentSet?.is_dropset,
    },
  ];

  return (
    <AnchoredModal
      isVisible={isVisible}
      closeModal={closeModal}
      anchorRef={buttonRef}
      anchorCorner="LEFT"
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
  questionButton: {
    marginLeft: "auto",
    backgroundColor: AppColors.darkBlue,
    padding: 2,
    borderRadius: 10,
  },
  optionLetter: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SetOptionsModal;
