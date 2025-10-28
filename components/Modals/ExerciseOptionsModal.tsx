import { StyleSheet, View } from "react-native";
import { useMemo, useState } from "react";
import AnchoredModal from "./AnchoredModal";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AutoRestTimeSettings from "../AutoRestTimeSettings";
import exerciseOptions from "@/components/exerciseOptions";
import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import { Exercise } from "@/types/exercises";
import useActiveWorkout from "@/store/useActiveWorkout";
import useExerciseOptionsModal from "@/store/useExerciseOptionsModal";
import ModalOptionButton from "./ModalOptionButton";
import userStore from "@/store/userStore";
import useActionModal from "@/store/useActionModal";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useShallow } from "zustand/shallow";

const MODAL_WIDTH = 275;

const ExerciseOptionsModal = function ExerciseOptionsModal() {
  const [currentScreen, setCurrentScreen] = useState("main");
  const [currentTimer, setCurrentTimer] = useState<"timer" | "warmup_timer">(
    "timer"
  );

  const {
    isVisible,
    closeModal,
    setExerciseTimer,
    setWarmupTimer,
    buttonRef,
    workoutExercise,
  } = useExerciseOptionsModal((state) => state);
  const {
    openModal: openWorkoutExercisesModal,
    closeModal: closeExercisesModal,
  } = useWorkoutExercisesModal();
  const {
    replaceWorkoutExercise,
    updateWorkoutExerciseField,
    removeWorkoutExercise,
  } = useActiveWorkout(
    useShallow((state) => ({
      replaceWorkoutExercise: state.replaceWorkoutExercise,
      updateWorkoutExerciseField: state.updateWorkoutExerciseField,
      removeWorkoutExercise: state.removeWorkoutExercise,
    }))
  );
  const user = userStore((state) => state.user);
  const openWarningModal = useActionModal((state) => state.openModal);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(Number(translateX.value), { duration: 300 }) },
    ],
  }));

  if (!workoutExercise) return null;

  const closeModalHandler = () => {
    closeModal();
    setCurrentTimer("timer");
    if (currentScreen === "autoRest") {
      switchToMainScreen();
    }
  };

  const switchToAutoRestScreen = () => {
    setCurrentScreen("autoRest");
    translateX.value = Number(-MODAL_WIDTH);
  };

  const openWarningModalHandler = () => {
    openWarningModal({
      title: "Remove Exercise?",
      subtitle: `This removes '${workoutExercise.exercises.name}' and all of its sets from your
    workout. You cannot undo this action.`,
      onProceed: removeExerciseHandler,
    });
    closeModalHandler();
  };

  const openExerciseModalHandler = () => {
    openWorkoutExercisesModal(replaceExerciseHandler, false, "Replace");
    closeModalHandler();
  };

  const replaceExerciseHandler = async (exercises: Exercise[]) => {
    await replaceWorkoutExercise(workoutExercise.id, exercises[0], user!.id);
    closeExercisesModal();
  };

  const noteHandler = () => {
    updateWorkoutExerciseField(workoutExercise.id, {
      note: {
        ...workoutExercise.note,
        showNote: !workoutExercise.note?.showNote,
      },
    });
    closeModalHandler();
  };
  const generateNoteOptionName = () => {
    if (workoutExercise.note?.showNote) return "Remove note";
    else return "New note";
  };
  const removeFromSuperset = () => {
    updateWorkoutExerciseField(workoutExercise.id, { superset: null });
  };
  const options = exerciseOptions({
    exerciseTimer: workoutExercise.timer,
    switchToAutoRestScreen,
    openWarningModalHandler,
    openExerciseModalHandler,
    noteHandler,
    generateNoteOptionName,
    removeFromSuperset,
    superset: workoutExercise.superset,
    theme,
  });
  const switchToMainScreen = () => {
    translateX.value = 0;
    setCurrentScreen("main");
  };

  const updateTimer = (
    timerName: "timer" | "warmup_timer",
    timerValue: number | null
  ) => {
    updateWorkoutExerciseField(workoutExercise.id, { [timerName]: timerValue });
  };
  const removeExerciseHandler = () => {
    removeWorkoutExercise(workoutExercise.id);
  };

  return (
    <AnchoredModal
      isVisible={isVisible}
      closeModal={closeModalHandler}
      anchorRef={buttonRef!}
      anchorCorner="RIGHT"
      backgroundColor={theme.darkBlue}
      modalWidth={MODAL_WIDTH}
      alignItems="flex-start"
      padding={0}
    >
      <Animated.View
        style={[styles.container, animatedStyle, { width: MODAL_WIDTH * 2 }]}
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
          <View style={{ flex: 1 }}>
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
        </View>
      </Animated.View>
    </AnchoredModal>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    screen: {
      width: MODAL_WIDTH,
      padding: 5,
    },
  });

export default ExerciseOptionsModal;
