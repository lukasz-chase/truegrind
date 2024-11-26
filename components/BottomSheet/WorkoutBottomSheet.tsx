import { useRef, useMemo, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBackdrop from "./CustomBackdrop";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";
import useBottomSheet from "@/store/useBottomSheet";
import { SharedValue } from "react-native-reanimated";
import WorkoutExercise from "./WorkoutExercise";
import { ScrollView } from "react-native-gesture-handler";
import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutDetails from "./WorkoutDetails";

type Props = {
  animatedIndex: SharedValue<number>;
};

const WorkoutBottomSheet = ({ animatedIndex }: Props) => {
  const [sheetIndex, setSheetIndex] = useState(0);
  const { setIsSheetVisible } = useBottomSheet();
  const { activeWorkout } = useActiveWorkout();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [130, "90%"], []);
  const handleClosePress = useCallback(() => {
    setIsSheetVisible(false);
    sheetRef.current?.close();
    animatedIndex.value = 0;
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
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
          <CustomHeader sheetIndex={sheetIndex} close={handleClosePress} />
          <WorkoutDetails />
          <ScrollView>
            {activeWorkout?.workout_exercises
              ?.sort((a, b) => a.order - b.order)
              .map((workoutExercise) => (
                <WorkoutExercise
                  key={workoutExercise.id}
                  workoutExercise={workoutExercise}
                />
              ))}
            <CustomFooter close={handleClosePress} />
          </ScrollView>
        </BottomSheet>
      </View>
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
