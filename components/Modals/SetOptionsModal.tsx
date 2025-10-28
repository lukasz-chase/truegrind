import { StyleSheet, Text, View } from "react-native";
import AnchoredModal from "./AnchoredModal";
import ModalOptionButton from "./ModalOptionButton";
import { AntDesign } from "@expo/vector-icons";
import useActiveWorkout from "@/store/useActiveWorkout";
import useSetOptionsModal from "@/store/useSetOptionsModal";
import { ExerciseSet } from "@/types/exercisesSets";
import { Pressable } from "react-native";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";
import { useShallow } from "zustand/shallow";

const MODAL_WIDTH = 275;

const SetOptionsModal = function ExerciseOptionsModal() {
  const { isVisible, closeModal, buttonRef, exerciseId, exerciseSetId } =
    useSetOptionsModal(
      useShallow((state) => ({
        isVisible: state.isVisible,
        closeModal: state.closeModal,
        ...state.setProps,
      }))
    );
  const { updateExerciseSet, activeWorkout } = useActiveWorkout(
    useShallow((state) => ({
      updateExerciseSet: state.updateExerciseSet,
      activeWorkout: state.activeWorkout,
    }))
  );
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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
      <AntDesign name="question" size={24} color={theme.white} />
    </Pressable>
  );

  const options = [
    {
      Icon: (
        <Text style={[styles.optionLetter, { color: theme.orange }]}>W</Text>
      ),
      title: "Warm Up",
      cb: () => updateSetHandler("is_warmup"),
      rightSide: questionButton,
      isActive: currentSet?.is_warmup,
    },
    {
      Icon: (
        <Text style={[styles.optionLetter, { color: theme.purple }]}>D</Text>
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
      backgroundColor={theme.darkBlue}
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    wrapper: {
      width: "100%",
    },
    questionButton: {
      marginLeft: "auto",
      backgroundColor: theme.darkBlue,
      padding: 2,
      borderRadius: 10,
    },
    optionLetter: {
      fontWeight: "bold",
      fontSize: 18,
    },
  });

export default SetOptionsModal;
