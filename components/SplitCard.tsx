import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Split } from "@/types/split";
import { AppColors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { updateUserProfile } from "@/lib/userService";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { deleteSplit } from "@/lib/splitsServices";

type Props = {
  split: Split;
  userId: string;
  refetchData: () => void;
  isActiveSplit: boolean;
  removeLocalSplit: (splitId: string) => void;
};

const INITIAL_BUTTON_WIDTH = 70;
const BUTTON_MARGIN = 20;

const SplitCard = ({
  split,
  userId,
  refetchData,
  isActiveSplit,
  removeLocalSplit,
}: Props) => {
  const router = useRouter();

  const translateX = useSharedValue(0);
  const buttonWidth = useSharedValue(INITIAL_BUTTON_WIDTH);

  const [rowWidth, setRowWidth] = useState(0);
  const [hapticTriggered, setHapticTriggered] = useState(false);
  const [movedPassTreshold, setMovedPassTreshold] = useState(false);

  const chooseSplitHandler = () => {
    if (!isActiveSplit) router.push("/");
    updateUserProfile(userId, { active_split_id: split.id });
    refetchData();
    router.push("/");
  };

  const handleHapticFeedback = () => {
    if (!hapticTriggered || movedPassTreshold) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      setHapticTriggered(true);
    }
  };

  const deleteSplitHandler = async () => {
    if (isActiveSplit) {
      await updateUserProfile(userId, { active_split_id: null });
    }
    await deleteSplit(split.id);
    removeLocalSplit(split.id);
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 0])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -rowWidth);
        buttonWidth.value =
          INITIAL_BUTTON_WIDTH +
          BUTTON_MARGIN +
          Math.min(-translateX.value, rowWidth);

        if (translateX.value < -rowWidth * 0.5 && !hapticTriggered) {
          runOnJS(handleHapticFeedback)();
          runOnJS(setMovedPassTreshold)(true);
        }

        if (translateX.value >= -rowWidth * 0.5 && hapticTriggered) {
          runOnJS(handleHapticFeedback)();
          runOnJS(setMovedPassTreshold)(false);
          runOnJS(setHapticTriggered)(false);
        }
      }
    })
    .onEnd(() => {
      if (translateX.value < -rowWidth * 0.5) {
        translateX.value = withTiming(-rowWidth, {}, () =>
          runOnJS(deleteSplitHandler)()
        );
        buttonWidth.value = withTiming(
          rowWidth + INITIAL_BUTTON_WIDTH + BUTTON_MARGIN
        );
      } else {
        translateX.value = withTiming(0);
        buttonWidth.value = withTiming(INITIAL_BUTTON_WIDTH);
        runOnJS(setHapticTriggered)(false);
        runOnJS(setMovedPassTreshold)(false);
      }
    });
  const deleteButtonStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
  }));
  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  return (
    <GestureHandlerRootView
      style={[
        styles.splitCard,
        { backgroundColor: isActiveSplit ? AppColors.blue : "white" },
      ]}
      onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          deleteButtonStyle,
          {
            transform: [
              {
                translateX: INITIAL_BUTTON_WIDTH + BUTTON_MARGIN,
              },
            ],
            alignItems: movedPassTreshold ? "flex-start" : "center",
          },
        ]}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Animated.View>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[rowStyle]}>
          <Pressable onPress={chooseSplitHandler}>
            <Text
              style={[
                styles.splitTitle,
                { color: isActiveSplit ? "white" : AppColors.black },
              ]}
            >
              {split.name}
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  splitCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: AppColors.blue,
    padding: 20,
    borderRadius: 10,
  },
  splitTitle: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "red",
    justifyContent: "center",
    borderRadius: 8,
    paddingInline: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SplitCard;
