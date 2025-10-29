import { ITEM_HEIGHT } from "@/constants/drag";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { WorkoutExercisePopulated } from "@/types/workoutExercise";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const moveArrayItem = (arr: string[], from: number, to: number): string[] => {
  "worklet";
  const newArr = [...arr];
  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);
  return newArr;
};

type Props = {
  item: WorkoutExercisePopulated;
  index: number;
  itemsOrder: string[];
  setItemsOrder: React.Dispatch<React.SetStateAction<string[]>>;
  onReorder?: (newOrder: string[]) => void;
  dragItemId: string | null;
};

const DraggableItem = ({
  item,
  index,
  itemsOrder,
  setItemsOrder,
  onReorder,
  dragItemId,
}: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isPressedItem = dragItemId === item.id;
  const y = useSharedValue(index * ITEM_HEIGHT);
  const isActive = useSharedValue(isPressedItem);
  const startY = useSharedValue(index * ITEM_HEIGHT);

  useEffect(() => {
    const newIndex = itemsOrder.indexOf(item.id);
    y.value = withSpring(newIndex * ITEM_HEIGHT, {
      damping: 20,
      stiffness: 200,
    });
  }, [itemsOrder, item.id, y]);

  const longPressGesture = Gesture.LongPress().onStart(() => {
    isActive.value = true;
    startY.value = y.value;
  });

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onUpdate((event) => {
      if (!isActive.value) return;
      const newPosition = startY.value + event.translationY;
      y.value = newPosition;

      // Use midpoint logic to determine reordering
      const oldIndex = itemsOrder.indexOf(item.id);
      const halfItemHeight = ITEM_HEIGHT / 2;
      const newIndex = Math.min(
        itemsOrder.length - 1,
        Math.max(0, Math.floor((newPosition + halfItemHeight) / ITEM_HEIGHT))
      );

      if (newIndex !== oldIndex) {
        const updatedOrder = moveArrayItem(itemsOrder, oldIndex, newIndex);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(setItemsOrder)(updatedOrder);
      }
    })
    .onEnd(() => {
      if (isActive.value) {
        isActive.value = false;
        const finalIndex = itemsOrder.indexOf(item.id);
        y.value = withSpring(finalIndex * ITEM_HEIGHT, {
          damping: 20,
          stiffness: 200,
        });
        if (onReorder) {
          runOnJS(onReorder)(itemsOrder);
        }
      }
    });

  const combinedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      height: ITEM_HEIGHT,
      transform: [{ translateY: y.value }],
      zIndex: isActive.value ? 10 : 1,
      elevation: isActive.value ? 5 : 0,
      backgroundColor: isActive.value ? theme.lightBlue : theme.background,
    };
  });

  return (
    <>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.header, animatedStyle]}>
          <Text style={styles.headerTitle}>{item.exercises.name}</Text>
          <View style={styles.headerOptions}>
            <FontAwesome5 name="grip-lines" size={24} color={theme.black} />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    headerTitle: {
      color: theme.blue,
      fontSize: 20,
    },
    headerOptions: {
      backgroundColor: theme.blue,
      paddingHorizontal: 5,
      borderRadius: 10,
    },
  });
export default DraggableItem;
