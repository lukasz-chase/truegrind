import { useState, useEffect, useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { Workout } from "@/types/workout";
import DraggableWorkoutCard from "./DraggableWorkoutCard";
import { DRAGGABLE_WORKOUT_CARD_HEIGHT } from "@/constants/drag";
import WorkoutCardPreview from "./WorkoutCardPreview";

type SortableWorkoutGridProps = {
  workouts: Workout[];
  scrollRef: React.RefObject<Animated.ScrollView | null>;
  scrollY: Animated.SharedValue<number>;
  sourceFolderId: string | null;
  setDraggedWorkout: React.Dispatch<React.SetStateAction<Workout | null>>;
  setSourceFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  folderId: string;
  hoveredFolderId: string | null;
  setHoveredFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  handleMoveToFolder: (
    workoutId: string,
    targetFolderId: string
  ) => Promise<void>;
  dragAbsoluteY: SharedValue<number | null>;
  onReorder: (folderId: string, newOrderIds: string[]) => Promise<void>;
  newTemplateHandler: (folderId: string) => void;
};

const SortableWorkoutGrid: React.FC<SortableWorkoutGridProps> = ({
  workouts,
  scrollRef,
  scrollY,
  setDraggedWorkout,
  setSourceFolderId,
  sourceFolderId,
  folderId,
  hoveredFolderId,
  setHoveredFolderId,
  handleMoveToFolder,
  dragAbsoluteY,
  onReorder,
  newTemplateHandler,
}) => {
  const [order, setOrder] = useState<string[]>([
    ...workouts.map((item) => item.id),
  ]);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const hoverAnim = useSharedValue(0);

  const isHovered = hoveredFolderId === folderId;

  useEffect(() => {
    hoverAnim.value = withTiming(isHovered ? 1 : 0, { duration: 200 });
  }, [isHovered]);

  const onDragMove = useCallback((key: string, newIndex: number) => {
    setDraggedKey(key);
    setDragIndex(newIndex);
  }, []);

  const onDragEnd = useCallback(() => {
    // first, synchronously build the brand-new array:
    if (dragIndex != null && draggedKey) {
      const fromIndex = order.indexOf(draggedKey);
      const newOrder = [...order];
      newOrder.splice(dragIndex, 0, newOrder.splice(fromIndex, 1)[0]);

      if (folderId === hoveredFolderId) onReorder(folderId, newOrder);

      // *then* update your own state so the UI mirrors it:
      setOrder(newOrder);
    }

    // finally clear drag state
    setDraggedKey(null);
    setDragIndex(null);
    setDraggedWorkout(null);
    setSourceFolderId(null);
    setHoveredFolderId(null);
  }, [order, dragIndex, draggedKey, folderId, onReorder, hoveredFolderId]);

  const folderAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(100, 200, 255, ${hoverAnim.value * 0.06})`,
      borderWidth: hoverAnim.value * 2,
      borderColor: `rgba(100, 200, 255, ${hoverAnim.value * 0.4})`,
      borderRadius: 12,
    };
  });
  const noWorkouts = workouts.length === 0;
  return (
    <Animated.View
      style={[
        {
          marginTop: 10,
          height: noWorkouts
            ? DRAGGABLE_WORKOUT_CARD_HEIGHT
            : Math.ceil(workouts.length / 2) * DRAGGABLE_WORKOUT_CARD_HEIGHT,
        },
        folderAnimatedStyle,
      ]}
    >
      {workouts.length === 0 && (
        <WorkoutCardPreview
          newTemplateHandler={() => newTemplateHandler(folderId)}
        />
      )}
      {order.map((workoutId) => {
        const workout = workouts.find((w) => w.id === workoutId);
        if (!workout) return null;
        return (
          <DraggableWorkoutCard
            key={workout.id}
            itemKey={workout.id}
            workout={workout}
            order={order}
            draggedKey={draggedKey}
            dragIndex={dragIndex}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            scrollRef={scrollRef}
            scrollY={scrollY}
            setDraggedWorkout={setDraggedWorkout}
            setSourceFolderId={setSourceFolderId}
            folderId={folderId}
            handleMoveToFolder={handleMoveToFolder}
            sourceFolderId={sourceFolderId}
            hoveredFolderId={hoveredFolderId}
            dragAbsoluteY={dragAbsoluteY}
            hoverAnim={hoverAnim}
          />
        );
      })}
    </Animated.View>
  );
};

export default SortableWorkoutGrid;
