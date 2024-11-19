import React, { useRef, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, useAnimatedValue } from "react-native";
import BottomSheet, { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { Workout } from "@/types/workout";
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
  const snapPoints = useMemo(() => [150, "90%"], []);
  const { activeWorkout, setIsSheetVisible } = useBottomSheet();
  const handleClosePress = useCallback(() => {
    setIsSheetVisible(false);
    sheetRef.current?.close();
    animatedIndex.value = 0;
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
        >
          {/* Header */}
          <CustomHeader />

          {/* Content */}
          <BottomSheetFlashList
            data={activeWorkout?.workout_exercises}
            keyExtractor={(i: any) => i.id.toString()}
            renderItem={({ item }: { item: any }) => (
              <Text>{item.exercises.name}</Text>
            )}
            contentContainerStyle={styles.contentContainer}
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
  contentContainer: {
    backgroundColor: "white",
  },
  handle: {
    paddingTop: 10,
    paddingBottom: 0,
  },
});

export default WorkoutBottomSheet;
