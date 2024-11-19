import React, { useRef, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, useAnimatedValue } from "react-native";
import BottomSheet, { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { Workout } from "@/types/workout";
import CustomBackdrop from "./CustomBackdrop";
import CustomHeader from "./CustomHeader";
import Portal from "../Portal/Portal";
import CustomFooter from "./CustomFooter";
import useBottomSheet from "@/store/useBottomSheet";

type Props = {
  onClose: () => void;
  workout: Workout;
};

const WorkoutBottomSheet = ({ onClose, workout }: Props) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [150, "90%"], []);

  const handleClosePress = useCallback(() => {
    useBottomSheet.setState({ sheetIndex: 0 });
    sheetRef.current?.close();
    onClose();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    useBottomSheet.setState({ sheetIndex: index });
  }, []);
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Portal name="bottomsheet">
          <BottomSheet
            onClose={onClose}
            ref={sheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            animateOnMount={true}
            index={1}
            handleStyle={styles.handle}
            backdropComponent={CustomBackdrop}
            onChange={handleSheetChanges}
          >
            {/* Header */}
            <CustomHeader />

            {/* Content */}
            <BottomSheetFlashList
              data={workout.workout_exercises}
              keyExtractor={(i: any) => i.id.toString()}
              renderItem={({ item }: { item: any }) => (
                <Text>{item.exercises.name}</Text>
              )}
              contentContainerStyle={styles.contentContainer}
              estimatedItemSize={100}
            />
            <CustomFooter close={handleClosePress} />
          </BottomSheet>
        </Portal>
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
  contentContainer: {
    backgroundColor: "white",
  },
  handle: {
    paddingTop: 10,
    paddingBottom: 0,
  },
});

export default WorkoutBottomSheet;
