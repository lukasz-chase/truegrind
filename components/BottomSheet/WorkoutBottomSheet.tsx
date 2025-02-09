import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import CustomBackdrop from "./CustomBackdrop";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";
import useBottomSheet from "@/store/useBottomSheet";
import { SharedValue } from "react-native-reanimated";
import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutDetails from "./WorkoutDetails";
import CustomKeyboard from "../Keyboard/CustomKeyboard";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import DraggableList from "./DraggableExercisesList.tsx/DraggableList";
import WorkoutExercise from "./WorkoutExercise";
import WorkoutExerciseWrapper from "./WorkoutExerciseWrapper";

type Props = {
  animatedIndex: SharedValue<number>;
};

const WorkoutBottomSheet = ({ animatedIndex }: Props) => {
  const [sheetIndex, setSheetIndex] = useState(0);
  const [scrolledY, setScrolledY] = useState(0);
  const [dragItemId, setDragItemId] = useState<string | null>(null);

  const { setIsSheetVisible, setBottomSheetScrollViewRef } = useBottomSheet();
  const { activeWorkout, reorderWorkoutExercises } = useActiveWorkout();
  const { closeKeyboard } = useCustomKeyboard();

  const sheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null);

  useEffect(() => {
    setBottomSheetScrollViewRef(scrollViewRef);
  }, [scrollViewRef]);

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
        <Pressable style={styles.container} onPress={closeKeyboard}>
          <CustomHeader
            sheetIndex={sheetIndex}
            close={handleClosePress}
            scrolledY={scrolledY}
          />
          <BottomSheetScrollView ref={scrollViewRef} onScroll={handleScroll}>
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
                <WorkoutExerciseWrapper
                  dragItemId={dragItemId}
                  key={workoutExercise.id}
                >
                  {workoutExercise.superset && (
                    <View
                      style={[
                        styles.supersetIndicator,
                        { backgroundColor: workoutExercise.superset },
                      ]}
                    />
                  )}
                  <WorkoutExercise
                    workoutExercise={workoutExercise}
                    setDragItemId={setDragItemId}
                  />
                </WorkoutExerciseWrapper>
              ))}
            <CustomFooter close={handleClosePress} />
          </BottomSheetScrollView>
        </Pressable>
      </BottomSheet>
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
  supersetIndicator: {
    width: 2,
    height: "100%",
  },
});

export default WorkoutBottomSheet;
