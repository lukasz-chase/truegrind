import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const ITEM_HEIGHT = 60;
const SCREEN_WIDTH = Dimensions.get("window").width;

interface ItemData {
  id: string;
  title: string;
}

interface DraggableItemProps {
  item: ItemData;
  index: number;
  itemsOrder: string[];
  setItemsOrder: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Utility function to reorder array elements.
 */
const moveArrayItem = (arr: string[], from: number, to: number): string[] => {
  "worklet";
  const newArr = [...arr];
  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);
  return newArr;
};

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  itemsOrder,
  setItemsOrder,
  setActiveIndex,
}) => {
  const y = useSharedValue(index * ITEM_HEIGHT);
  const isActive = useSharedValue(false);
  const startY = useSharedValue(index * ITEM_HEIGHT);

  // State to control when pan is enabled
  const [canPan, setCanPan] = useState(false);

  useEffect(() => {
    // Animate to the new position when itemsOrder changes
    const newIndex = itemsOrder.indexOf(item.id);
    y.value = withSpring(newIndex * ITEM_HEIGHT, {
      damping: 20,
      stiffness: 200,
    });
  }, [itemsOrder, item.id, y]);

  const longPressGesture = Gesture.LongPress().onStart(() => {
    // Activate dragging once the long press is recognized
    isActive.value = true;
    runOnJS(setActiveIndex)(itemsOrder.indexOf(item.id));
    startY.value = y.value; // record the item’s current position
    runOnJS(setCanPan)(true); // Enable pan now that long press has succeeded
  });

  const panGesture = Gesture.Pan()
    .minDistance(20)
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
        runOnJS(setItemsOrder)(updatedOrder);
        runOnJS(setActiveIndex)(newIndex);
      }
    })
    .onEnd(() => {
      if (isActive.value) {
        isActive.value = false;
        // Snap to final position after release
        const finalIndex = itemsOrder.indexOf(item.id);
        y.value = withSpring(finalIndex * ITEM_HEIGHT, {
          damping: 20,
          stiffness: 200,
        });
        runOnJS(setCanPan)(false); // Disable pan again after drag ends
      }
    });

  // Use simultaneous to allow the long press to activate first, then pan
  const combinedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: SCREEN_WIDTH,
      height: ITEM_HEIGHT,
      transform: [{ translateY: y.value }],
      zIndex: isActive.value ? 10 : 1,
      elevation: isActive.value ? 5 : 0,
      shadowColor: "#000",
      shadowOpacity: isActive.value ? 0.2 : 0,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 5,
      backgroundColor: "#eee",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      justifyContent: "center",
      paddingHorizontal: 20,
    };
  });

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={animatedStyle}>
        <Text style={styles.itemText}>{item.title}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default function DraggableList() {
  const [data] = useState<ItemData[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i}`,
    }))
  );
  const [itemsOrder, setItemsOrder] = useState<string[]>(data.map((d) => d.id));
  const [activeIndex, setActiveIndex] = useState(-1);

  const sortedData = itemsOrder.map((id) => data.find((d) => d.id === id)!);

  return (
    <View
      style={{
        height: sortedData.length * ITEM_HEIGHT,
      }}
    >
      {sortedData.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          itemsOrder={itemsOrder}
          setItemsOrder={setItemsOrder}
          setActiveIndex={setActiveIndex}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  itemText: {
    fontSize: 16,
  },
});
