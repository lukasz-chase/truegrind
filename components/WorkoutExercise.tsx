import { Exercise } from "@/types/exercises";
import { ExerciseSet } from "@/types/exercisesSets";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutSet from "./WorkoutSet";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {
  exercise: Exercise;
  exerciseSets: ExerciseSet[];
};
const WorkoutExercise = ({ exercise, exerciseSets }: Props) => {
  const { addNewSet } = useActiveWorkout();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <Pressable style={styles.headerOptions}>
          <SimpleLineIcons name="options" size={24} color={AppColors.blue} />
        </Pressable>
      </View>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Set</Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>
            Previous
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Kg</Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
            Reps
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
            Done
          </Text>
        </View>

        {exerciseSets
          .sort((a, b) => a.order - b.order)
          .map((set) => (
            <WorkoutSet
              key={set.id}
              exerciseSet={set}
              exerciseId={exercise.id}
            />
          ))}
      </View>
      <Animated.View layout={LinearTransition}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addNewSet(exercise.id)}
        >
          <Text style={styles.addButtonText}>+ Add Set</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  addButton: {
    marginTop: 16,
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
