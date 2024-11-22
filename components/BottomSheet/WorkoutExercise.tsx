import { Exercise } from "@/types/exercises";
import { ExerciseSet } from "@/types/exercisesSets";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import WorkoutSet from "./WorkoutSet";
import Animated, { LinearTransition } from "react-native-reanimated";
import ExerciseOptionsModal from "../Modals/ExerciseOptionsModal";
import { useRef, useState } from "react";

type Props = {
  exercise: Exercise;
  exerciseSets: ExerciseSet[];
  workoutExerciseId: string;
};
const WorkoutExercise = ({
  exercise,
  exerciseSets,
  workoutExerciseId,
}: Props) => {
  const { addNewSet } = useActiveWorkout();
  const [isVisible, setIsVisible] = useState(false);
  const newRef = useRef(null);
  const [buttonPosition, setButtonPosition] = useState({
    fx: 0,
    fy: 0,
    width: 0,
    height: 0,
  });
  const onButtonPress = () => {
    (newRef?.current as any).measureInWindow(
      (fx: number, fy: number, width: number, height: number) => {
        setButtonPosition({ fx: fx, fy: fy, height, width });
        setIsVisible(true);
      }
    );
  };
  const onModalClose = () => {
    setIsVisible(false);
  };
  return (
    <>
      <Animated.View style={styles.container} layout={LinearTransition}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{exercise.name}</Text>
          <Pressable
            style={styles.headerOptions}
            ref={newRef}
            onPress={onButtonPress}
          >
            <SimpleLineIcons name="options" size={24} color={AppColors.blue} />
          </Pressable>
        </View>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
              Set
            </Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>
              Previous
            </Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
              Kg
            </Text>
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
        <Animated.View
          layout={LinearTransition}
          style={styles.addButtonContainer}
        >
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addNewSet(workoutExerciseId)}
          >
            <Text style={styles.addButtonText}>+ Add Set</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <ExerciseOptionsModal
        exerciseName={exercise.name}
        closeModal={onModalClose}
        isVisible={isVisible}
        exerciseId={exercise.id}
        buttonPosition={buttonPosition}
        setIsVisible={setIsVisible}
      />
    </>
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
