import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import { formatTime } from "@/utils/calendar";
import useThemeStore from "@/store/useThemeStore";
import { AppTheme, AppThemeEnum, ThemeColors } from "@/types/user";

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
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme, mode), [theme, mode]);
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
                <Ionicons
                  name="timer-outline"
                  size={20}
                  color={theme.textColor}
                />
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
                { backgroundColor: theme.white, zIndex: 4 },
              ]}
            />
            <View
              style={[
                styles.timerButtonAbsoluteBackground,
                { backgroundColor: theme.textColor },
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
          <Ionicons name="timer-outline" size={20} color={theme.textColor} />
        </View>
      )}
    </Pressable>
  );
};

const makeStyles = (theme: ThemeColors, mode: AppTheme) =>
  StyleSheet.create({
    timerButton: {
      backgroundColor: mode === AppThemeEnum.DARK ? theme.black : theme.gray,
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
      backgroundColor: theme.blue,
      zIndex: 2,
    },
    grayLayer: {
      backgroundColor: theme.gray,
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
      color: theme.textColor,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default TimerButton;
