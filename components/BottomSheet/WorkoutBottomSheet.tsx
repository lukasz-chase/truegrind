import React, { useRef, useMemo, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Workout } from "@/types/workout";
import CustomBackdrop from "./CustomBackdrop";
import CustomHeader from "./CustomHeader";

type Props = {
  onClose: () => void;
  workout: Workout;
};

const WorkoutBottomSheet = ({ onClose, workout }: Props) => {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [70, "90%"], []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    onClose();
  }, []);

  return (
    <View style={styles.overlay}>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          onClose={onClose}
          ref={sheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          animateOnMount={true}
          index={1}
          handleStyle={styles.handle}
          backdropComponent={CustomBackdrop}
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
        </BottomSheet>
      </GestureHandlerRootView>
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
