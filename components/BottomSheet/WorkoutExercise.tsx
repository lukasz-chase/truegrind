import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutSet from "./WorkoutSet";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useRef } from "react";
import { WorkoutExercisePopulated } from "@/types/workoutExercise";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import useExerciseOptionsModal from "@/store/useExerciseOptionsModal";

type Props = {
  workoutExercise: WorkoutExercisePopulated;
};
const WorkoutExercise = ({ workoutExercise }: Props) => {
  const { addNewSet } = useActiveWorkout();
  const { openModal } = useExerciseOptionsModal();
  const buttonRef = useRef(null);
  const { closeKeyboard } = useCustomKeyboard();
  const onButtonPress = () => {
    closeKeyboard();
    openModal({
      buttonRef,
      exerciseName: workoutExercise.exercises.name,
      exerciseTimer: workoutExercise.timer,
      workoutExerciseId: workoutExercise.id,
    });
  };

  return (
    <Animated.View style={styles.container} layout={LinearTransition}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{workoutExercise.exercises.name}</Text>
        <Pressable
          style={styles.headerOptions}
          ref={buttonRef}
          onPress={onButtonPress}
        >
          <SimpleLineIcons name="options" size={24} color={AppColors.blue} />
        </Pressable>
      </View>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { flex: 0.75 }]}>
            Set
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1.75 }]}>
            Previous
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>
            Kg
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1.3 }]}>
            Reps
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
            Done
          </Text>
        </View>

        {workoutExercise.exercise_sets
          .sort((a, b) => a.order - b.order)
          .map((set) => (
            <WorkoutSet
              key={set.id}
              exerciseSet={set}
              exerciseId={workoutExercise.exercises.id}
              exerciseTimer={workoutExercise.timer}
            />
          ))}
      </View>
      <Animated.View
        layout={LinearTransition}
        style={styles.addButtonContainer}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addNewSet(workoutExercise.id)}
        >
          <Text style={styles.addButtonText}>+ Add Set</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: AppColors.blue,
    fontSize: 20,
  },
  headerOptions: {
    backgroundColor: AppColors.lightBlue,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  table: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRow: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    color: "#c1c1c1",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: "center",
    justifyContent: "center",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 16,
  },
  addButtonContainer: {
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  addButtonText: {
    fontWeight: "500",
    fontSize: 18,
  },
});

export default WorkoutExercise;
