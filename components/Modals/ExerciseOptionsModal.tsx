import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
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
import { supabase } from "@/lib/supabase";
import useAppStore from "@/store/useAppStore";
import { getOptions } from "@/lib/workoutOptions";
import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import { Exercise } from "@/types/exercises";
import useActiveWorkout from "@/store/useActiveWorkout";

const MODAL_WIDTH = 275;

type Props = {
  workoutExerciseId: string;
  exerciseName: string;
  isVisible: boolean;
  exerciseTimer: number | null;
  closeModal: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.MutableRefObject<null>;
};

const OptionButton = ({
  title,
  Icon,
  cb,
  rightSide,
}: {
  title: string;
  Icon: any;
  cb: () => void;
  rightSide?: any;
}) => (
  <Pressable style={styles.pressableButton} onPress={cb}>
    {Icon}
    <Text style={styles.pressableText}>{title}</Text>
    {rightSide && rightSide}
  </Pressable>
);

const ExerciseOptionsModal = function ExerciseOptionsModal({
  workoutExerciseId,
  exerciseName,
  exerciseTimer,
  closeModal,
  isVisible,
  setIsVisible,
  buttonRef,
}: Props) {
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
  const { openModal, closeModal: closeExercisesModal } =
    useWorkoutExercisesModal();
  const translateX = useSharedValue(0);
  const { replaceWorkoutExercise, updateWorkoutExerciseField } =
    useActiveWorkout();

  const switchToAutoRestScreen = () => {
    setCurrentScreen("autoRest");
    translateX.value = -MODAL_WIDTH;
  };

  const onDismiss = () => {
    if (warningState.shouldShow)
      setWarningState((state) => ({ ...state, isVisible: true }));
    if (shouldShowExercisesModal) openModal(replaceExerciseHandler);
  };

  const replaceExerciseHandler = (exercise: Exercise) => {
    replaceWorkoutExercise(workoutExerciseId, exercise);
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
    setIsVisible,
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
      { translateX: withTiming(translateX.value, { duration: 300 }) },
    ],
  }));

  const closeWarningModal = () => {
    setWarningState((state) => ({ ...state, isVisible: true }));
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
                <OptionButton key={option.title} {...option} />
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
  pressableButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
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
  pressableEndWrapper: {
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    flexDirection: "row",
  },
  backButton: {
    padding: 10,
    backgroundColor: AppColors.blue,
    borderRadius: 5,
  },
  autoRestText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default ExerciseOptionsModal;
