import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import WorkoutSet from "./WorkoutSet";
import Animated, { LinearTransition, runOnJS } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  WorkoutExercise as WorkoutExerciseType,
  WorkoutExercisePopulated,
} from "@/types/workoutExercise";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import useExerciseOptionsModal from "@/store/useExerciseOptionsModal";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import CustomTextInput from "../CustomTextInput";
import { EXERCISE_HEADER } from "@/constants/exerciseHeader";
import useExerciseDetailsModal from "@/store/useExerciseDetailsModal";
import { ExerciseSet } from "@/types/exercisesSets";
import useThemeStore from "@/store/useThemeStore";
import { AppTheme, AppThemeEnum, ThemeColors } from "@/types/user";

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
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme, mode), [theme, mode]);
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
            <SimpleLineIcons name="options" size={24} color={theme.blue} />
          </Pressable>
        </View>
      </GestureDetector>
      {note.showNote && (
        <View style={styles.textWrapper}>
          <CustomTextInput
            onChangeText={noteChangeHandler}
            placeholder="Add a note"
            value={note.noteValue}
            backgroundColor={theme.yellow}
            textColor={theme.textColor}
          />
        </View>
      )}
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          {EXERCISE_HEADER.map((header) => {
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

const makeStyles = (theme: ThemeColors, mode: AppTheme) =>
  StyleSheet.create({
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
      color: theme.blue,
      fontSize: 20,
      width: "100%",
    },
    headerOptions: {
      backgroundColor: theme.lightBlue,
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
      color: theme.textColor,
    },
    addButtonContainer: {
      paddingHorizontal: 12,
      marginVertical: 12,
    },
    addButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: mode === AppThemeEnum.DARK ? theme.black : theme.gray,
      alignItems: "center",
    },
    addButtonText: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    textWrapper: {
      padding: 5,
    },
  });

export default WorkoutExercise;
