import React, { useRef, useMemo, useCallback, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import CustomBackdrop from "./CustomBackdrop";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";
import useBottomSheet from "@/store/useBottomSheet";
import { SharedValue } from "react-native-reanimated";

type Props = {
  animatedIndex: SharedValue<number>;
};

const WorkoutBottomSheet = ({ animatedIndex }: Props) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [130, "90%"], []);
  const [sheetIndex, setSheetIndex] = useState(0);
  const { activeWorkout, setIsSheetVisible } = useBottomSheet();
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
          style={styles.bottomSheet}
          onChange={handleSheetChanges}
        >
          {/* Header */}
          <CustomHeader
            workoutName={activeWorkout?.name ?? ""}
            sheetIndex={sheetIndex}
            close={handleClosePress}
          />

          {/* Content */}
          <BottomSheetFlashList
            data={activeWorkout?.workout_exercises}
            keyExtractor={(i: any) => i.id.toString()}
            renderItem={({ item }: { item: any }) => (
              <Text>{item.exercises.name}</Text>
            )}
            contentContainerStyle={styles.exercisesWrapper}
            estimatedItemSize={100}
          />
          <CustomFooter close={handleClosePress} />
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
  bottomSheet: {},
  exercisesWrapper: {
    backgroundColor: "white",
  },
  handle: {
    paddingTop: 5,
    paddingBottom: 0,
  },
});

export default WorkoutBottomSheet;
