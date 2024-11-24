import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/colors";
import RemoveExerciseModal from "./RemoveExerciseModal";
import { useState } from "react";
import AnchoredModal from "./AnchoredModal";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AutoRestTimeSettings from "../AutoRestTimeSettings";

type Props = {
  exerciseId: string;
  exerciseName: string;
  isVisible: boolean;
  exerciseTimer: number | null;
  closeModal: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.MutableRefObject<null>;
};

const ExerciseOptionsModal = function ExerciseOptionsModal({
  exerciseId,
  exerciseName,
  exerciseTimer,
  closeModal,
  isVisible,
  setIsVisible,
  buttonRef,
}: Props) {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("main"); // Track the current screen
  const translateX = useSharedValue(0);
  const modalWidth = 275;
  const switchToAutoRestScreen = () => {
    setCurrentScreen("autoRest");
    translateX.value = -modalWidth; // Animate to the second screen
  };

  const switchToMainScreen = () => {
    setCurrentScreen("main");
    translateX.value = 0; // Animate back to the main screen
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value, { duration: 300 }) },
    ],
  }));

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
      IconEnd: (
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={AppColors.blue}
        />
      ),
      cb: switchToAutoRestScreen,
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

  const onDismiss = () => {
    if (openWarning) setIsWarningVisible(true);
  };

  return (
    <>
      <AnchoredModal
        isVisible={isVisible}
        closeModal={closeModal}
        anchorRef={buttonRef}
        onDismiss={onDismiss}
        anchorCorner="RIGHT"
        backgroundColor={AppColors.darkBlue}
        modalWidth={modalWidth}
      >
        <Animated.View
          style={[styles.container, animatedStyle, { width: modalWidth }]}
        >
          {/* Main Screen */}
          <View style={styles.screen}>
            {options.map(({ title, Icon, cb, IconEnd }) => (
              <Pressable
                key={title}
                style={styles.pressableButton}
                onPress={cb}
              >
                {Icon}
                <Text style={styles.pressableText}>{title}</Text>
                {IconEnd && (
                  <View style={styles.pressableEndWrapper}>
                    <Text
                      style={[styles.pressableText, { fontWeight: "normal" }]}
                    >
                      {exerciseTimer ? exerciseTimer : "Off"}
                    </Text>
                    {IconEnd}
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.screen}>
            <AutoRestTimeSettings
              screenWidth={modalWidth}
              switchToMainScreen={switchToMainScreen}
            />
          </View>
        </Animated.View>
      </AnchoredModal>

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
  container: {
    flexDirection: "row",
  },
  screen: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
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
