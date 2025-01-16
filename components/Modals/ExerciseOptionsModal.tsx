import { StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";
import WarningModal from "./WarningModal";
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
  const {
    isVisible,
    closeModal,
    setExerciseTimer,
    setWarmupTimer,
    buttonRef,
    workoutExercise,
  } = useExerciseOptionsModal((state) => state);
  const { openModal, closeModal: closeExercisesModal } =
    useWorkoutExercisesModal();
  const {
    replaceWorkoutExercise,
    updateWorkoutExerciseField,
    removeWorkoutExercise,
  } = useActiveWorkout();

  const [warningState, setWarningState] = useState({
    isVisible: false,
    shouldShow: false,
  });
  const [shouldShowExercisesModal, setShouldShowExercisesModal] =
    useState(false);
  const [currentScreen, setCurrentScreen] = useState("main");
  const [currentTimer, setCurrentTimer] = useState<"timer" | "warmup_timer">(
    "timer"
  );
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(Number(translateX.value), { duration: 300 }) },
    ],
  }));

  if (!workoutExercise) return null;

  const switchToAutoRestScreen = () => {
    setCurrentScreen("autoRest");
    translateX.value = Number(-MODAL_WIDTH);
  };

  const onDismiss = () => {
    if (warningState.shouldShow) {
      setWarningState((state) => ({ ...state, isVisible: true }));
      setWarningState((state) => ({ ...state, shouldShow: false }));
    }
    if (shouldShowExercisesModal) {
      openModal(replaceExerciseHandler, false, "Replace");
      setShouldShowExercisesModal(false);
    }
  };

  const replaceExerciseHandler = (exercises: Exercise[]) => {
    replaceWorkoutExercise(workoutExercise.id, exercises[0]);
    closeExercisesModal();
    setShouldShowExercisesModal(false);
  };

  const openExercisesModal = () => {
    setShouldShowExercisesModal(true);
    closeModal();
  };

  const noteHandler = () => {
    updateWorkoutExerciseField(workoutExercise.id, {
      note: {
        ...workoutExercise.note,
        showNote: !workoutExercise.note?.showNote,
      },
    });
    closeModal();
  };
  const generateNoteOptionName = () => {
    if (workoutExercise.note?.showNote) return "Remove note";
    else return "New note";
  };
  const removeFromSuperset = () => {
    updateWorkoutExerciseField(workoutExercise.id, { superset: null });
  };
  const options = getOptions({
    exerciseTimer: workoutExercise.timer,
    switchToAutoRestScreen,
    closeModal,
    setWarningState,
    openExercisesModal,
    noteHandler,
    generateNoteOptionName,
    removeFromSuperset,
    superset: workoutExercise.superset,
  });
  const switchToMainScreen = () => {
    translateX.value = 0;
    setCurrentScreen("main");
  };

  const closeWarningModal = () => {
    setWarningState((state) => ({ ...state, isVisible: false }));
  };

  const closeHandler = () => {
    closeModal();
    setCurrentTimer("timer");
    if (currentScreen === "autoRest") {
      switchToMainScreen();
    }
  };

  const updateTimer = (
    timerName: "timer" | "warmup_timer",
    timerValue: number | null
  ) => {
    updateWorkoutExerciseField(workoutExercise.id, { [timerName]: timerValue });
  };
  const removeExerciseHandler = () => {
    removeWorkoutExercise(workoutExercise.id);
    setWarningState({ isVisible: false, shouldShow: false });
  };
  return (
    <>
      <AnchoredModal
        isVisible={isVisible}
        closeModal={closeHandler}
        anchorRef={buttonRef!}
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
              {options.map((option) => {
                if (option.conditionToDisplay) {
                  return <ModalOptionButton key={option.title} {...option} />;
                }
              })}
            </View>
          </View>

          <View style={styles.screen}>
            <AutoRestTimeSettings
              screenWidth={MODAL_WIDTH}
              translateX={translateX}
              exerciseTimer={workoutExercise.timer}
              setExerciseTimer={setExerciseTimer}
              warmupTimer={workoutExercise.warmup_timer}
              setWarmupTimer={setWarmupTimer}
              switchToMainScreen={switchToMainScreen}
              setCurrentTimer={setCurrentTimer}
              currentTimer={currentTimer}
              updateTimer={updateTimer}
            />
          </View>
        </Animated.View>
      </AnchoredModal>
      <WarningModal
        closeModal={closeWarningModal}
        isVisible={warningState.isVisible}
        title="Remove Exercise?"
        subtitle={`This removes '${workoutExercise.exercises.name}' and all of its sets from your
        workout. You cannot undo this action.`}
        onCancel={closeWarningModal}
        onProceed={removeExerciseHandler}
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
