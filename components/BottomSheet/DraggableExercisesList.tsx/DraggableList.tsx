import { WorkoutExercisePopulated } from "@/types/workoutExercise";
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import DraggableItem from "./DraggableItem";
import { ITEM_HEIGHT } from "@/constants/drag";

type Props = {
  data: WorkoutExercisePopulated[];
  onReorder?: (newOrder: string[]) => void;
  dragItemId: string | null;
};

const DraggableList = ({ data, onReorder, dragItemId }: Props) => {
  const [itemsOrder, setItemsOrder] = useState(data.map((d) => d.id));
  useEffect(() => {
    setItemsOrder(data.map((d) => d.id));
  }, [data]);
  return (
    <View style={[styles.container, { height: data.length * ITEM_HEIGHT }]}>
      {data.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          itemsOrder={itemsOrder}
          setItemsOrder={setItemsOrder}
          onReorder={onReorder}
          dragItemId={dragItemId}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
});

export default DraggableList;
