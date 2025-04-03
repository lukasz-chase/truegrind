import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AppColors } from "@/constants/colors";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import TimerSettings from "./TimerSettings";

type Props = {
  screenWidth: number;
  translateX: Animated.SharedValue<number>;
  exerciseTimer: number | null;
  setExerciseTimer: (exerciseTimer: number | null) => void;
  warmupTimer: number | null;
  setWarmupTimer: (warmupTimer: number | null) => void;
  switchToMainScreen: () => void;
  setCurrentTimer: React.Dispatch<
    React.SetStateAction<"timer" | "warmup_timer">
  >;
  currentTimer: "timer" | "warmup_timer";
  updateTimer: (
    timerName: "timer" | "warmup_timer",
    timerValue: number | null
  ) => void;
};

const AutoRestTimeSettings = ({
  screenWidth,
  warmupTimer,
  exerciseTimer,
  setExerciseTimer,
  setWarmupTimer,
  switchToMainScreen,
  setCurrentTimer,
  currentTimer,
  translateX,
  updateTimer,
}: Props) => {
  const buttonBackgroundLeftPosition = useSharedValue(0);

  const SWIPE_THRESHOLD = screenWidth / 2;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const translationX = event.translationX;
      if (translationX > 50) {
        translateX.value = withTiming(Math.min(translationX, SWIPE_THRESHOLD), {
          duration: 0,
        });
      }
    })
    .onEnd((event) => {
      const translationX = Number(event.translationX);
      if (translationX > SWIPE_THRESHOLD) {
        runOnJS(switchToMainScreen)();
      } else {
        translateX.value = withSpring(-screenWidth, {
          duration: 300,
        });
      }
    });

  const timerHeaderHandler = (
    position: number,
    timerName: "timer" | "warmup_timer"
  ) => {
    setCurrentTimer(timerName);
    buttonBackgroundLeftPosition.value = withTiming(position, {
      duration: 200,
    });
  };

  const timerUpdateHandler = (timerValue: number | null) => {
    updateTimer(currentTimer, timerValue);
    if (currentTimer === "timer") setExerciseTimer(timerValue);
    else setWarmupTimer(timerValue);
  };

  const buttonsHeaderAnimatedStyles = useAnimatedStyle(() => ({
    left: buttonBackgroundLeftPosition.value,
  }));
  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={switchToMainScreen}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={AppColors.blue}
            />
          </Pressable>
          <Text style={styles.text}>Auto Rest Timer</Text>
          <View style={{ width: 10 }} />
        </View>
        <View style={styles.buttonsWrapper}>
          <Animated.View
            style={[styles.buttonsBackground, buttonsHeaderAnimatedStyles]}
          />
          <Pressable
            style={styles.headerButton}
            onPress={() => timerHeaderHandler(0, "timer")}
          >
            <Text style={styles.headerButtonText}>Working</Text>
          </Pressable>
          <Pressable
            style={styles.headerButton}
            onPress={() =>
              timerHeaderHandler(screenWidth / 2 - 10, "warmup_timer")
            }
          >
            <Text style={styles.headerButtonText}>Warm Up</Text>
          </Pressable>
        </View>
        {currentTimer === "timer" ? (
          <TimerSettings
            setTimer={timerUpdateHandler}
            timerValue={exerciseTimer}
          />
        ) : (
          <TimerSettings
            setTimer={timerUpdateHandler}
            timerValue={warmupTimer}
          />
        )}
      </View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsWrapper: {
    justifyContent: "space-evenly",
    height: 30,
    flexDirection: "row",
    backgroundColor: AppColors.charcoalGray,
    borderRadius: 10,
  },
  buttonsBackground: {
    backgroundColor: AppColors.graphiteGray,
    position: "absolute",
    height: 30,
    width: "50%",
    left: 0,
    borderRadius: 10,
  },
  headerButton: {
    height: 30,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default AutoRestTimeSettings;
