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
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import CustomHandle from "./CustomHandle";
import { useShallow } from "zustand/shallow";

type Props = {
  animatedIndex: SharedValue<number>;
};

const WorkoutBottomSheet = ({ animatedIndex }: Props) => {
  const [sheetIndex, setSheetIndex] = useState(0);
  const [scrolledY, setScrolledY] = useState(0);
  const [dragItemId, setDragItemId] = useState<string | null>(null);

  const { setIsSheetVisible, setBottomSheetScrollViewRef } = useBottomSheet();
  const {
    activeWorkout,
    reorderWorkoutExercises,
    updateWorkoutField,
    addNewSet,
    deleteExerciseSet,
    updateExerciseSet,
    updateWorkoutExerciseField,
  } = useActiveWorkout(
    useShallow((state) => ({
      activeWorkout: state.activeWorkout,
      reorderWorkoutExercises: state.reorderWorkoutExercises,
      updateWorkoutField: state.updateWorkoutField,
      addNewSet: state.addNewSet,
      deleteExerciseSet: state.deleteExerciseSet,
      updateExerciseSet: state.updateExerciseSet,
      updateWorkoutExerciseField: state.updateWorkoutExerciseField,
    }))
  );
  const { closeKeyboard } = useCustomKeyboard();

  const sheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);

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
        backdropComponent={CustomBackdrop}
        animatedIndex={animatedIndex}
        enableOverDrag={false}
        onChange={handleSheetChanges}
        style={styles.sheetShadow}
        handleComponent={() => <CustomHandle theme={theme} />}
      >
        <Pressable style={styles.container} onPress={closeKeyboard}>
          <CustomHeader
            sheetIndex={sheetIndex}
            close={handleClosePress}
            scrolledY={scrolledY}
          />
          <BottomSheetScrollView ref={scrollViewRef} onScroll={handleScroll}>
            <WorkoutDetails
              workout={activeWorkout}
              updateWorkoutField={updateWorkoutField}
            />
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
                    addNewSet={addNewSet}
                    deleteExerciseSet={deleteExerciseSet}
                    updateExerciseSet={updateExerciseSet}
                    updateWorkoutExerciseField={updateWorkoutExerciseField}
                  />
                </WorkoutExerciseWrapper>
              ))}
            <CustomFooter close={handleClosePress} theme={theme} />
          </BottomSheetScrollView>
        </Pressable>
      </BottomSheet>
      <CustomKeyboard animatedIndex={animatedIndex} />
    </View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
    },
    sheetShadow: {
      borderWidth: 0,
      borderRadius: 24,
      shadowColor: theme.black,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 10,
    },
    container: {
      backgroundColor: theme.background,
      paddingBottom: 30,
      flexGrow: 1,
    },
    supersetIndicator: {
      width: 2,
      height: "100%",
    },
  });

export default WorkoutBottomSheet;
