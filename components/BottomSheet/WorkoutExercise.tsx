import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { AppColors } from "@/constants/colors";
import WorkoutSet from "./WorkoutSet";
import Animated, { LinearTransition, runOnJS } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import {
  WorkoutExercise as WorkoutExerciseType,
  WorkoutExercisePopulated,
} from "@/types/workoutExercise";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import useExerciseOptionsModal from "@/store/useExerciseOptionsModal";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import CustomTextInput from "../CustomTextInput";
import { exerciseHeader } from "@/constants/exerciseHeader";
import useExerciseDetailsModal from "@/store/useExerciseDetailsModal";
import { ExerciseSet } from "@/types/exercisesSets";

type Props = {
  workoutExercise: WorkoutExercisePopulated;
  setDragItemId: React.Dispatch<React.SetStateAction<string | null>>;
  updateWorkoutExerciseField: (
    workoutExerciseId: string,
    propertiesToUpdate: Partial<WorkoutExerciseType>
  ) => void;
  addNewSet: (exerciseId: string) => void;
  updateExerciseSet: (
    exerciseId: string,
    setId: string,
    propertiesToUpdate: Partial<ExerciseSet>
  ) => void;
  deleteExerciseSet: (exerciseId: string, setId: string) => void;
  isEditTemplate?: boolean;
};
const WorkoutExercise = ({
  workoutExercise,
  setDragItemId,
  addNewSet,
  updateWorkoutExerciseField,
  updateExerciseSet,
  deleteExerciseSet,
  isEditTemplate = false,
}: Props) => {
  const { openModal } = useExerciseOptionsModal();
  const { closeKeyboard } = useCustomKeyboard();
  const { openModal: openExerciseDetailsModal } = useExerciseDetailsModal();
  const [note, setNote] = useState(
    workoutExercise?.note ?? { noteValue: "", showNote: false }
  );
  useEffect(() => {
    if (workoutExercise.note) {
      setNote(workoutExercise.note);
    }
  }, [workoutExercise.note]);

  const buttonRef = useRef(null);

  const onButtonPress = () => {
    closeKeyboard();
    openModal(buttonRef, workoutExercise);
  };

  const noteChangeHandler = (text: string) => {
    const newNote = { ...note, noteValue: text };
    setNote(newNote);
    updateWorkoutExerciseField(workoutExercise.id, { note: newNote });
  };

  const longPressGesture = Gesture.LongPress().onStart((event) => {
    runOnJS(setDragItemId)(workoutExercise.id);
  });

  const openExerciseDetailsModalHandler = () => {
    openExerciseDetailsModal(workoutExercise.exercises);
  };

  return (
    <Animated.View style={styles.container} layout={LinearTransition}>
      <GestureDetector gesture={longPressGesture}>
        <View style={styles.header}>
          <Pressable
            onPress={openExerciseDetailsModalHandler}
            style={styles.headerTitleButton}
          >
            <Text style={styles.headerTitle}>
              {workoutExercise.exercises.name}
            </Text>
          </Pressable>
          <Pressable
            style={styles.headerOptions}
            ref={buttonRef}
            onPress={onButtonPress}
          >
            <SimpleLineIcons name="options" size={24} color={AppColors.blue} />
          </Pressable>
        </View>
      </GestureDetector>
      {note.showNote && (
        <View style={styles.textWrapper}>
          <CustomTextInput
            onChangeText={noteChangeHandler}
            placeholder="Add a note"
            value={note.noteValue}
            backgroundColor="#FCF2CC"
            textColor="#8F7F3B"
          />
        </View>
      )}
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          {exerciseHeader.map((header) => {
            return (
              <Text
                key={header.label}
                style={[
                  styles.cell,
                  styles.headerCell,
                  { flex: header.flexValue },
                ]}
              >
                {header.label}
              </Text>
            );
          })}
        </View>
        {workoutExercise.exercise_sets.map((set) => (
          <WorkoutSet
            key={set.id}
            exerciseSet={set}
            exerciseId={workoutExercise.exercises.id}
            exerciseTimer={workoutExercise.timer}
            warmupTimer={workoutExercise.warmup_timer}
            updateExerciseSet={updateExerciseSet}
            deleteExerciseSet={deleteExerciseSet}
            isEditTemplate={isEditTemplate}
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitleButton: {
    flex: 1,
  },
  headerTitle: {
    color: AppColors.blue,
    fontSize: 20,
    width: "100%",
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
  textWrapper: {
    padding: 5,
  },
});

export default WorkoutExercise;
