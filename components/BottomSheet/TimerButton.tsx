import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import { formatTime } from "@/utils/calendar";

type Props = {
  openModal: () => void;
  isRunning: boolean;
  timeRemaining: number;
  totalDuration: number;
};

const TIMER_BUTTON_WIDTH = 80;

const TimerButton = ({
  openModal,
  timeRemaining,
  isRunning,
  totalDuration,
}: Props) => {
  const animatedWidth = useSharedValue(TIMER_BUTTON_WIDTH);
  const { closeKeyboard } = useCustomKeyboard();
  useEffect(() => {
    if (isRunning) {
      animatedWidth.value = withTiming(
        (timeRemaining / totalDuration) * TIMER_BUTTON_WIDTH,
        { duration: 500 }
      );
    }
  }, [timeRemaining, isRunning]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentWidth = animatedWidth.value;
    return {
      width: currentWidth,
      borderRadius: Math.min(currentWidth / 2, 10), // Adjust dynamically
    };
  });

  return (
    <Pressable
      onPress={() => {
        openModal();
        closeKeyboard();
      }}
    >
      {isRunning ? (
        <View style={styles.timerButtonContainer}>
          {/* MaskedView for text color animation */}
          <MaskedView
            style={[styles.timerButtonAbsolute]}
            maskElement={
              <View style={[styles.maskContent]}>
                <Ionicons name="timer-outline" size={20} />
                <Text style={[styles.textStyles]}>
                  {formatTime(timeRemaining)}
                </Text>
              </View>
            }
          >
            <Animated.View
              style={[
                styles.timerButtonAbsoluteBackground,
                animatedStyle,
                { backgroundColor: AppColors.white, zIndex: 4 },
              ]}
            />
            <View
              style={[
                styles.timerButtonAbsoluteBackground,
                { backgroundColor: AppColors.black },
              ]}
            />
          </MaskedView>

          <Animated.View
            style={[
              styles.timerButtonAbsoluteBackground,
              styles.blueLayer,
              animatedStyle,
            ]}
          />
          <View
            style={[styles.timerButtonAbsoluteBackground, styles.grayLayer]}
          />
        </View>
      ) : (
        <View style={styles.timerButton}>
          <Ionicons name="timer-outline" size={20} color={AppColors.black} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  timerButton: {
    backgroundColor: AppColors.gray,
    padding: 10,
    width: 52,
    borderRadius: 10,
    height: 40,
    alignItems: "center",
  },
  timerButtonContainer: {
    position: "relative",
    height: 40,
    width: TIMER_BUTTON_WIDTH,
  },
  timerButtonAbsoluteBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: TIMER_BUTTON_WIDTH,
    borderRadius: 10,
  },
  timerButtonAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: TIMER_BUTTON_WIDTH,
    backgroundColor: "transparent",
    zIndex: 3,
  },
  blueLayer: {
    backgroundColor: AppColors.blue,
    zIndex: 2,
  },
  grayLayer: {
    backgroundColor: AppColors.gray,
  },
  maskContent: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "transparent",
    height: "100%",
    width: TIMER_BUTTON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyles: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TimerButton;
