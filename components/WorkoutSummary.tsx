import { AppColors } from "@/constants/colors";
import { WorkoutHistory } from "@/types/workout";
import { WorkoutExercisePopulated } from "@/types/workoutExercise";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatDate } from "@/lib/helpers";
import { fetchHighestWeightSet } from "@/lib/exerciseSetsService";

const WorkoutSummary = ({ workout }: { workout: WorkoutHistory }) => {
  const [PRs, setPRs] = useState(0);
  useEffect(() => {
    searchPRs();
  }, [workout]);
  const searchPRs = async () => {
    // If `workout.workout_exercises` is undefined, fallback to []
    const workoutExercises = workout.workout_exercises ?? [];

    // Build an array of Promises, one per exercise
    const foundPRs = workoutExercises.map(async (workoutExercise) => {
      const highestWeight = workoutExercise.exercise_sets.reduce(
        (max, set) => Math.max(max, set.weight ?? 0),
        0
      );

      if (highestWeight === 0) return {};
      const { data, error } = await fetchHighestWeightSet(
        workoutExercise.exercises.id,
        highestWeight
      );
      return { data, error };
    });

    // Wait for all to complete
    const allResults = await Promise.all(foundPRs);

    // Inspect what you got
    allResults.forEach(({ data, error }, idx) => {
      if (error) {
        console.error(`Query #${idx} failed:`, error);
      } else {
        if (data && data.length === 0) {
          setPRs((prevPRs) => prevPRs + 1);
        }
      }
    });
  };

  const weightLifted = () => {
    let totalWeight = 0;
    workout.workout_exercises?.forEach((workoutExercise) => {
      totalWeight += workoutExercise.exercise_sets.reduce(
        (total, set) => total + (set.weight ?? 0),
        0
      );
    });
    return `${totalWeight}kg`;
  };
  const bestExerciseSet = (workoutExercise: WorkoutExercisePopulated) => {
    const best = workoutExercise.exercise_sets.reduce(
      (bestSet, set) => {
        if (
          set.weight &&
          set.reps &&
          set.weight * set.reps > bestSet.weight * bestSet.reps
        ) {
          return { weight: set.weight, reps: set.reps };
        }
        return bestSet;
      },
      { weight: 0, reps: 0 }
    );

    return `${best.weight}kg x ${best.reps}`;
  };
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.columnText, { fontWeight: "bold" }]}>
        {workout?.name}
      </Text>
      <Text style={styles.columnText}>{formatDate(new Date())}</Text>
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <AntDesign name="clockcircle" size={24} color={AppColors.black} />
          <Text style={styles.columnText}>{workout.workout_time}</Text>
        </View>
        <View style={styles.headerItem}>
          <FontAwesome6
            name="weight-hanging"
            size={24}
            color={AppColors.black}
          />
          <Text style={styles.columnText}>{weightLifted()}</Text>
        </View>
        <View style={styles.headerItem}>
          <FontAwesome6 name="trophy" size={24} color={AppColors.black} />
          <Text style={styles.columnText}>{PRs} PRs</Text>
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.columnRow}>
          <Text style={[styles.columnText, { flex: 1.5, fontWeight: "bold" }]}>
            Exercise
          </Text>
          <Text style={[styles.columnText, { flex: 1, fontWeight: "bold" }]}>
            Best Set
          </Text>
        </View>
        {workout.workout_exercises?.map((workoutExercise) => (
          <View style={styles.columnRow} key={workoutExercise.id}>
            <Text style={[styles.columnText, { flex: 1.5 }]}>
              {workoutExercise.exercise_sets.length} x{" "}
              {workoutExercise.exercises.name}
            </Text>
            <Text style={[styles.columnText, { flex: 1 }]}>
              {bestExerciseSet(workoutExercise)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: AppColors.gray,
    width: "100%",
    gap: 10,
    padding: 10,
  },
  modalCloseButton: {
    backgroundColor: AppColors.gray,
    padding: 4,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  headerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  table: {
    gap: 5,
  },
  columnRow: {
    flexDirection: "row",
    width: "100%",
  },
  columnText: {
    fontSize: 16,
  },
});
export default WorkoutSummary;
