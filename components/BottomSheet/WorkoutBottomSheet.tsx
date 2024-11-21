import React, { useRef, useMemo, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInput,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBackdrop from "./CustomBackdrop";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";
import useBottomSheet from "@/store/useBottomSheet";
import { SharedValue } from "react-native-reanimated";
import { Workout } from "@/types/workout";
import { AppColors } from "@/constants/colors";
import WorkoutExercise from "../WorkoutExercise";
import { ScrollView } from "react-native-gesture-handler";
import useActiveWorkout from "@/store/useActiveWorkout";

type Props = {
  animatedIndex: SharedValue<number>;
};

const WorkoutBottomSheet = ({ animatedIndex }: Props) => {
  const [sheetIndex, setSheetIndex] = useState(0);
  const { setIsSheetVisible } = useBottomSheet();
  const { activeWorkout, updateWorkoutField } = useActiveWorkout();
  const [workoutElapsedTime, setWorkoutElapsedTime] = useState(0);
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
  const updateActiveWorkout = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
    name: keyof Workout
  ) => {
    const newValue = e.nativeEvent.text;
    updateWorkoutField(name, newValue);
  };

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
          {/* Header */}
          <CustomHeader
            workoutName={activeWorkout?.name ?? ""}
            sheetIndex={sheetIndex}
            close={handleClosePress}
            setWorkoutElapsedTime={setWorkoutElapsedTime}
            workoutElapsedTime={workoutElapsedTime}
          />
          <View style={styles.workoutDetails}>
            <TextInput
              placeholder={"Workout Name"}
              placeholderTextColor={AppColors.gray}
              onChange={(e) => updateActiveWorkout(e, "name")}
              maxLength={60}
              value={activeWorkout.name}
              style={styles.workoutName}
            />
            <Text style={styles.workoutTime}>
              {Math.floor(workoutElapsedTime / 60)}:
              {String(workoutElapsedTime % 60).padStart(2, "0")}
            </Text>
            <TextInput
              placeholder={"Notes"}
              placeholderTextColor={AppColors.gray}
              onChange={(e) => updateActiveWorkout(e, "notes")}
              maxLength={60}
              value={activeWorkout?.notes}
              style={styles.workoutNotes}
            />
          </View>
          <ScrollView>
            {activeWorkout?.workout_exercises?.map((workout) => (
              <WorkoutExercise
                key={workout.id}
                exercise={workout.exercises}
                exerciseSets={workout.exercise_sets}
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
  workoutDetails: {
    padding: 20,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  workoutTime: {
    fontSize: 18,
  },
  workoutNotes: {
    fontSize: 18,
    color: "black",
  },
});

export default WorkoutBottomSheet;
