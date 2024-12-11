import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import { AppColors } from "@/constants/colors";
import RemoveExerciseModal from "./RemoveExerciseModal";
import { useState } from "react";
import AnchoredModal from "./AnchoredModal";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AutoRestTimeSettings from "../AutoRestTimeSettings";
import { getOptions } from "@/lib/workoutOptions";
import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import { Exercise } from "@/types/exercises";
import useActiveWorkout from "@/store/useActiveWorkout";
import useExerciseOptionsModal from "@/store/useExerciseOptionsModal";
import ModalOptionButton from "./ModalOptionButton";

const MODAL_WIDTH = 275;

const ExerciseOptionsModal = function ExerciseOptionsModal() {
  const { isVisible, closeModal, exerciseProps } = useExerciseOptionsModal();
  const { buttonRef, exerciseName, exerciseTimer, workoutExerciseId } =
    exerciseProps;
  const { openModal, closeModal: closeExercisesModal } =
    useWorkoutExercisesModal();
  const { replaceWorkoutExercise, updateWorkoutExerciseField } =
    useActiveWorkout();

  const [warningState, setWarningState] = useState({
    isVisible: false,
    shouldShow: false,
  });
  const [shouldShowExercisesModal, setShouldShowExercisesModal] =
    useState(false);
  const [currentScreen, setCurrentScreen] = useState("main");
  const [customDuration, setCustomDuration] = useState(
    exerciseTimer ? exerciseTimer : 60
  );

  const translateX = useSharedValue(0);

  const switchToAutoRestScreen = () => {
    console.log("clicked");
    setCurrentScreen("autoRest");
    translateX.value = Number(-MODAL_WIDTH);
  };

  const onDismiss = () => {
    if (warningState.shouldShow)
      setWarningState((state) => ({ ...state, isVisible: true }));
    if (shouldShowExercisesModal)
      openModal(replaceExerciseHandler, false, "Replace");
  };

  const replaceExerciseHandler = (exercises: Exercise[]) => {
    replaceWorkoutExercise(workoutExerciseId, exercises[0]);
    closeExercisesModal();
    setShouldShowExercisesModal(false);
  };

  const openExercisesModal = () => {
    setShouldShowExercisesModal(true);
    closeModal();
  };
  const options = getOptions({
    exerciseTimer,
    switchToAutoRestScreen,
    closeModal,
    setWarningState,
    openExercisesModal,
  });
  const switchToMainScreen = () => {
    updateSettings();
    translateX.value = 0;
    setCurrentScreen("main");
  };
  const updateSettings = async () => {
    updateWorkoutExerciseField(workoutExerciseId, "timer", customDuration);
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(Number(translateX.value), { duration: 300 }) },
    ],
  }));

  const closeWarningModal = () => {
    setWarningState((state) => ({ ...state, isVisible: false }));
  };

  const closeHandler = () => {
    closeModal();
    if (currentScreen === "autoRest") {
      switchToMainScreen();
      updateSettings();
    }
  };
  return (
    <>
      <AnchoredModal
        isVisible={isVisible}
        closeModal={closeHandler}
        anchorRef={buttonRef}
        onDismiss={onDismiss}
        anchorCorner="RIGHT"
        backgroundColor={AppColors.darkBlue}
        modalWidth={MODAL_WIDTH}
      >
        <Animated.View
          style={[styles.container, animatedStyle, { width: MODAL_WIDTH }]}
        >
          {/* Main Screen */}
          <View style={styles.screen}>
            <View>
              {options.map((option) => (
                <ModalOptionButton key={option.title} {...option} />
              ))}
            </View>
          </View>

          <View style={styles.screen}>
            <AutoRestTimeSettings
              screenWidth={MODAL_WIDTH}
              translateX={translateX}
              exerciseTimer={exerciseTimer}
              setCustomDuration={setCustomDuration}
              customDuration={customDuration}
              switchToMainScreen={switchToMainScreen}
            />
          </View>
        </Animated.View>
      </AnchoredModal>
      <RemoveExerciseModal
        workoutExerciseId={workoutExerciseId}
        closeModal={closeWarningModal}
        isVisible={warningState.isVisible}
        exerciseName={exerciseName}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  screen: {
    width: "100%",
  },
});

export default ExerciseOptionsModal;
