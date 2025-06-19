import { useMemo, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Workout } from "@/types/workout";
import useWorkoutOptionsModal from "@/store/useWorkoutOptionsModal";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

type Props = {
  workout: Workout;
};

const WORKOUT_EXERCISE_NAMES_TO_SHOW = 3;

export default function WorkoutCardContent({ workout }: Props) {
  const buttonRef = useRef(null);
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { openModal: openOptionsModal } = useWorkoutOptionsModal();

  const handleOptions = () => {
    openOptionsModal({ workout, buttonRef });
  };

  const sorted = workout.workout_exercises
    ? [...workout.workout_exercises].sort((a, b) => a.order - b.order)
    : [];

  const toShow = sorted.slice(0, WORKOUT_EXERCISE_NAMES_TO_SHOW);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Pressable
          ref={buttonRef}
          onPress={handleOptions}
          style={styles.optionsButton}
        >
          <SimpleLineIcons name="options" size={20} color={theme.blue} />
        </Pressable>
      </View>
      <View style={styles.exerciseContainer}>
        {toShow.map((w) => (
          <Text key={w.id} style={styles.exercise} numberOfLines={1}>
            {w.exercises.name}
          </Text>
        ))}
        {workout.workout_exercises!.length > WORKOUT_EXERCISE_NAMES_TO_SHOW && (
          <Text style={styles.exercise}>
            &nbsp;+
            {workout.workout_exercises!.length -
              WORKOUT_EXERCISE_NAMES_TO_SHOW}{" "}
            more
          </Text>
        )}
      </View>
    </>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textColor,
    },
    exerciseContainer: {
      flexDirection: "column",
      marginTop: 8,
    },
    exercise: {
      marginBottom: 4,
      color: theme.lightText,
    },
    optionsButton: {
      paddingHorizontal: 5,
      backgroundColor: theme.lightBlue,
      borderRadius: 5,
    },
  });
