import { useRef, useMemo, useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import CustomBackdrop from "./CustomBackdrop";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";
import useBottomSheet from "@/store/useBottomSheet";
import { SharedValue } from "react-native-reanimated";
import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutDetails from "./WorkoutDetails";
import CustomKeyboard from "../CustomKeyboard";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import DraggableList from "./DraggableExercisesList.tsx/DraggableList";
import WorkoutExercise from "./WorkoutExercise";

type Props = {
  animatedIndex: SharedValue<number>;
};

const WorkoutBottomSheet = ({ animatedIndex }: Props) => {
  const [sheetIndex, setSheetIndex] = useState(0);
  const [scrolledY, setScrolledY] = useState(0);
  const [dragItemId, setDragItemId] = useState<string | null>(null);

  const { setIsSheetVisible } = useBottomSheet();
  const { activeWorkout, reorderWorkoutExercises } = useActiveWorkout();
  const { closeKeyboard } = useCustomKeyboard();

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [130, "90%"], []);

  const handleClosePress = useCallback(() => {
    closeKeyboard();
    setIsSheetVisible(false);
    sheetRef.current?.close();
    animatedIndex.value = 0;
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    closeKeyboard();
    setSheetIndex(index);
  }, []);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setScrolledY(scrollY);
  };

  const handleReorder = (newOrder: string[]) => {
    reorderWorkoutExercises(newOrder);
    setDragItemId(null);
  };
  return (
    <View style={styles.overlay}>
      <Pressable style={styles.container} onPress={closeKeyboard}>
        <BottomSheet
          onClose={handleClosePress}
          ref={sheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          animateOnMount={true}
          index={1}
          handleStyle={styles.handle}
          backdropComponent={CustomBackdrop}
          animatedIndex={animatedIndex}
          enableOverDrag={false}
          onChange={handleSheetChanges}
        >
          <CustomHeader
            sheetIndex={sheetIndex}
            close={handleClosePress}
            scrolledY={scrolledY}
          />
          <BottomSheetScrollView onScroll={handleScroll}>
            <WorkoutDetails />
            {dragItemId && (
              <DraggableList
                data={
                  activeWorkout?.workout_exercises?.sort(
                    (a, b) => a.order - b.order
                  ) ?? []
                }
                onReorder={handleReorder}
                dragItemId={dragItemId}
              />
            )}

            {activeWorkout?.workout_exercises
              ?.sort((a, b) => a.order - b.order)
              .map((workoutExercise) => (
                <WorkoutExercise
                  key={workoutExercise.id}
                  workoutExercise={workoutExercise}
                  setDragItemId={setDragItemId}
                  dragItemId={dragItemId}
                />
              ))}
            <CustomFooter close={handleClosePress} />
          </BottomSheetScrollView>
        </BottomSheet>
      </Pressable>
      <CustomKeyboard animatedIndex={animatedIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
  },
  handle: {
    paddingTop: 5,
    paddingBottom: 0,
  },
});

export default WorkoutBottomSheet;
