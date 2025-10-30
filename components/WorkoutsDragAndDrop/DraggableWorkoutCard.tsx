import { useEffect, useMemo } from "react";
import { StyleSheet, Platform } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Workout } from "@/types/workout";
import { SCREEN_HEIGHT } from "@/constants/device";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import useWorkoutPreviewModal from "@/store/useWorkoutPreviewModal";
import {
  DRAGGABLE_WORKOUT_CARD_HEIGHT,
  DRAGGABLE_WORKOUT_CARD_WIDTH,
} from "@/constants/drag";
import WorkoutCardContent from "../WorkoutCardContent";
import { scheduleOnRN } from "react-native-worklets";

const SCROLL_EDGE = 160; // how close to edge before scrolling
const SCROLL_SPEED = 20; // how many pixels per update

interface DraggableBoxProps {
  itemKey: string;
  workout: Workout;
  order: string[];
  draggedKey: string | null;
  dragIndex: number | null;
  onDragMove: (key: string, dragIndex: number) => void;
  onDragEnd: () => void;
  scrollRef: React.RefObject<Animated.ScrollView | null>;
  scrollY: SharedValue<number>;
  setDraggedWorkout: React.Dispatch<React.SetStateAction<Workout | null>>;
  setSourceFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  folderId: string;
  handleMoveToFolder: (
    workoutId: string,
    targetFolderId: string
  ) => Promise<void>;
  hoveredFolderId: string | null;
  sourceFolderId: string | null;
  dragAbsoluteY: SharedValue<number | null>;
  hoverAnim: SharedValue<number>;
}

export default ({
  itemKey,
  workout,
  order,
  draggedKey,
  dragIndex,
  onDragMove,
  onDragEnd,
  scrollRef,
  scrollY,
  setDraggedWorkout,
  setSourceFolderId,
  folderId,
  handleMoveToFolder,
  hoveredFolderId,
  sourceFolderId,
  dragAbsoluteY,
  hoverAnim,
}: DraggableBoxProps) => {
  const index = order.indexOf(itemKey);
  const x = useSharedValue((index % 2) * DRAGGABLE_WORKOUT_CARD_WIDTH);
  const y = useSharedValue(
    Math.floor(index / 2) * DRAGGABLE_WORKOUT_CARD_HEIGHT
  );
  const startScrollY = useSharedValue(0);
  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const { openModal } = useWorkoutPreviewModal();

  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  useEffect(() => {
    if (draggedKey !== itemKey) {
      const newIndex =
        dragIndex != null && draggedKey
          ? (() => {
              const ghostOrder = [...order];
              ghostOrder.splice(
                dragIndex,
                0,
                ghostOrder.splice(order.indexOf(draggedKey), 1)[0]
              );
              return ghostOrder.indexOf(itemKey);
            })()
          : index;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      x.value = withTiming((newIndex % 2) * DRAGGABLE_WORKOUT_CARD_WIDTH);
      y.value = withTiming(
        Math.floor(newIndex / 2) * DRAGGABLE_WORKOUT_CARD_HEIGHT
      );
    } else if (draggedKey === null && dragIndex === null) {
      const newIndex = order.indexOf(itemKey);
      x.value = withTiming((newIndex % 2) * DRAGGABLE_WORKOUT_CARD_WIDTH);
      y.value = withTiming(
        Math.floor(newIndex / 2) * DRAGGABLE_WORKOUT_CARD_HEIGHT
      );
    }
  }, [draggedKey, dragIndex, index, itemKey, order]);

  const startDrag = () => {
    initialX.value = x.value;
    initialY.value = y.value;
    startScrollY.value = scrollY.value;
    isDragging.value = true;
    scheduleOnRN(setDraggedWorkout, workout);
    scheduleOnRN(setSourceFolderId, folderId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const scrollPageHandler = (e: any) => {
    if (!scrollRef?.current) return;

    // Scroll up
    if (e.absoluteY < SCROLL_EDGE) {
      scrollRef.current.scrollTo({
        y: Math.max(scrollY.value - SCROLL_SPEED, 0),
        animated: false,
      });
      y.value -= SCROLL_SPEED;
    }
    // Scroll down
    else if (e.absoluteY > SCREEN_HEIGHT - SCROLL_EDGE) {
      scrollRef.current.scrollTo({
        y: scrollY.value + SCROLL_SPEED,
        animated: false,
      });
      y.value += SCROLL_SPEED;
    }
  };
  const openWorkoutModalHandler = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    openModal(workout);
  };

  const tap = Gesture.Tap()
    .onStart(() => {
      scheduleOnRN(openWorkoutModalHandler);
    })
    .hitSlop({ right: -30 });

  const pan = Gesture.Pan()
    .minDistance(30)
    .onUpdate((e) => {
      if (!isDragging.value) return;
      x.value = initialX.value + e.translationX;
      y.value =
        initialY.value + e.translationY + (scrollY.value - startScrollY.value);

      dragAbsoluteY.value = e.absoluteY;

      const dropCol = Math.round(x.value / DRAGGABLE_WORKOUT_CARD_HEIGHT);
      const dropRow = Math.round(y.value / DRAGGABLE_WORKOUT_CARD_WIDTH);
      const newIndex = Math.min(
        Math.max(dropRow * 2 + dropCol, 0),
        order.length - 1
      );
      scheduleOnRN(onDragMove, itemKey, newIndex);
      scheduleOnRN(scrollPageHandler, e);
    })
    .onEnd(() => {
      isDragging.value = false;

      scheduleOnRN(onDragEnd);

      if (hoveredFolderId && hoveredFolderId !== sourceFolderId) {
        scheduleOnRN(handleMoveToFolder, workout.id, hoveredFolderId);
      }
    });

  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      scheduleOnRN(startDrag);
    });
  const composed = Gesture.Simultaneous(longPress, pan, tap);

  const animatedStyle = useAnimatedStyle(() => {
    const isDraggingThis = draggedKey === itemKey;
    return {
      position: "absolute",
      width: DRAGGABLE_WORKOUT_CARD_WIDTH - 20,
      height: DRAGGABLE_WORKOUT_CARD_HEIGHT - 10,
      top: y.value,
      left: x.value,
      zIndex: isDraggingThis ? 10 : 1,
      transform: [{ scale: withTiming(isDraggingThis ? 1.05 : 1) }],
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: isDraggingThis ? 0.2 : 0,
      shadowRadius: 10,
      elevation: isDraggingThis ? 6 : 0,
      opacity: isDraggingThis ? 1 : hoverAnim.value * -0.5 + 1,
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.box, animatedStyle]}>
        <WorkoutCardContent workout={workout} />
      </Animated.View>
    </GestureDetector>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    box: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.lightText,
      padding: 10,
    },
  });
