import { Exercise } from "@/types/exercises";
import { ExerciseSet } from "@/types/exercisesSets";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { AppColors } from "@/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import useActiveWorkout from "@/store/useActiveWorkout";

type Props = {
  exercise: Exercise;
  exerciseSets: ExerciseSet[];
};
const WorkoutExercise = ({ exercise, exerciseSets }: Props) => {
  const { addNewSet, activeWorkout } = useActiveWorkout();
  const addSet = () => {
    addNewSet(exercise.id, {
      id: 3,
      workout_exercise_id: 1,
      order: exerciseSets.length + 1,
      reps: null,
      weight: null,
      is_warmup: false,
      is_dropset: false,
      reps_in_reserve: null,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <Pressable style={styles.headerOptions}>
          <SimpleLineIcons name="options" size={24} color={AppColors.blue} />
        </Pressable>
      </View>
      <View style={styles.table}>
        {/* Table Header */}
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

        {/* Table Rows */}
        {exerciseSets
          .sort((a, b) => a.order - b.order)
          .map((set) => (
            <View key={set.id} style={styles.row}>
              <View style={[styles.cell, { flex: 1 }]}>
                <Pressable style={styles.rowButton}>
                  <Text style={[styles.cellText, styles.rowButtonText]}>
                    {set.order}
                  </Text>
                </Pressable>
              </View>

              <Text style={[styles.cell, { flex: 2 }]}>-</Text>
              <TextInput
                value={`${set?.weight ?? ""}`}
                style={[styles.cell, styles.textInput, { flex: 1 }]}
              />
              <TextInput
                value={`${set?.reps ?? ""}`}
                style={[styles.cell, styles.textInput, { flex: 1 }]}
              />
              <View style={[styles.cell, { flex: 1, alignItems: "center" }]}>
                <Pressable style={styles.rowButton}>
                  <AntDesign name="check" size={20} color="black" />
                </Pressable>
              </View>
            </View>
          ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addSet}>
        <Text style={styles.addButtonText}>+ Add Set</Text>
      </TouchableOpacity>
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
  cellText: {
    fontSize: 14,
  },
  textInput: {
    backgroundColor: AppColors.gray,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 16,
    height: 30,
  },
  rowButton: {
    backgroundColor: AppColors.gray,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    paddingHorizontal: 10,
  },
  rowButtonText: {
    fontSize: 16,
    fontWeight: "bold",
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
