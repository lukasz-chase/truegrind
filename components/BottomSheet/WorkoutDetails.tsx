import useThemeStore from "@/store/useThemeStore";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import { AppThemeEnum, ThemeColors } from "@/types/user";
import { Workout } from "@/types/workout";
import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  workout: Workout;
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => void;
  isEditTemplate?: boolean;
};

const WorkoutDetails = ({
  workout,
  updateWorkoutField,
  isEditTemplate = false,
}: Props) => {
  const { formattedTime } = useWorkoutTimer();
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const updateActiveWorkout = (newValue: string, name: keyof Workout) => {
    updateWorkoutField(name, newValue);
  };
  return (
    <View style={styles.workoutDetails}>
      <TextInput
        placeholder={"Workout Name"}
        placeholderTextColor={
          mode === AppThemeEnum.DARK ? theme.lightBlue : theme.gray
        }
        onChange={(e) => updateActiveWorkout(e.nativeEvent.text, "name")}
        maxLength={60}
        value={workout.name}
        style={styles.workoutName}
      />
      {!isEditTemplate ? (
        <Text style={styles.workoutTime}>{formattedTime}</Text>
      ) : (
        <View style={{ height: 24 }} />
      )}
      <TextInput
        placeholder={"Notes"}
        placeholderTextColor={
          mode === AppThemeEnum.DARK ? theme.lightBlue : theme.gray
        }
        onChange={(e) => updateActiveWorkout(e.nativeEvent.text, "notes")}
        maxLength={60}
        value={workout?.notes}
        style={styles.workoutNotes}
      />
    </View>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    workoutDetails: {
      padding: 20,
    },
    workoutName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textColor,
    },
    workoutTime: {
      fontSize: 18,
      color: theme.textColor,
    },
    workoutNotes: {
      fontSize: 18,
      color: theme.textColor,
    },
  });
export default WorkoutDetails;
