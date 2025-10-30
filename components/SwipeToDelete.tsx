import React, { useMemo, useState } from "react";
import { Text, StyleSheet, Platform } from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import * as Haptics from "expo-haptics";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

const INITIAL_BUTTON_WIDTH = 70;
const BUTTON_MARGIN = 20;

type SwipeToDeleteProps = {
  children: React.ReactNode;
  onDelete: () => void;
  enabled?: boolean;
  deleteText?: string;
  deleteButtonContainerStyle?: object;
  deleteButtonTextStyle?: object;
  thresholdFraction?: number;
};

export default function SwipeToDelete({
  children,
  onDelete,
  enabled = true,
  deleteText = "Delete",
  deleteButtonContainerStyle = {},
  deleteButtonTextStyle = {},
  thresholdFraction = 0.5,
}: SwipeToDeleteProps) {
  const translateX = useSharedValue(0);
  const buttonWidth = useSharedValue(INITIAL_BUTTON_WIDTH);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [rowWidth, setRowWidth] = useState(0);
  const [hapticTriggered, setHapticTriggered] = useState(false);
  const [movedPastThreshold, setMovedPastThreshold] = useState(false);

  const handleHapticFeedback = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const swipeGesture = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-10, 0])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        // Don’t let user swipe beyond full width
        translateX.value = Math.max(event.translationX, -rowWidth);

        // Expand the red delete button as we swipe
        buttonWidth.value =
          INITIAL_BUTTON_WIDTH +
          BUTTON_MARGIN +
          Math.min(-translateX.value, rowWidth);

        // If we go beyond the threshold and haptic isn’t triggered yet
        if (
          translateX.value < -rowWidth * thresholdFraction &&
          !hapticTriggered
        ) {
          scheduleOnRN(handleHapticFeedback);
          scheduleOnRN(setHapticTriggered, true);
          scheduleOnRN(setMovedPastThreshold, true);
        }

        // If we go back above the threshold after crossing it
        if (
          translateX.value >= -rowWidth * thresholdFraction &&
          hapticTriggered
        ) {
          scheduleOnRN(setHapticTriggered, false);
          scheduleOnRN(setMovedPastThreshold, false);
        }
      }
    })
    .onEnd(() => {
      if (translateX.value < -rowWidth * thresholdFraction) {
        // Fully swipe off-screen, then trigger onDelete
        translateX.value = withTiming(-rowWidth, {}, () => {
          scheduleOnRN(onDelete);
        });
        buttonWidth.value = withTiming(
          rowWidth + INITIAL_BUTTON_WIDTH + BUTTON_MARGIN
        );
      } else {
        // Bounce back
        translateX.value = withTiming(0);
        buttonWidth.value = withTiming(INITIAL_BUTTON_WIDTH);
        scheduleOnRN(setHapticTriggered, false);
        scheduleOnRN(setMovedPastThreshold, false);
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
    alignItems: movedPastThreshold ? "flex-start" : "center",
    transform: [
      {
        translateX: INITIAL_BUTTON_WIDTH + BUTTON_MARGIN,
      },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ overflow: "hidden" }}>
      {/* The background container that holds the delete button */}
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          deleteButtonStyle,
          deleteButtonContainerStyle,
        ]}
      >
        <Text style={[styles.deleteButtonText, deleteButtonTextStyle]}>
          {deleteText}
        </Text>
      </Animated.View>

      {/* The actual row the user swipes */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
          style={[rowStyle]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    deleteButtonContainer: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.red,
      justifyContent: "center",
      borderRadius: 8,
      paddingHorizontal: 10,
    },
    deleteButtonText: {
      color: theme.white,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
