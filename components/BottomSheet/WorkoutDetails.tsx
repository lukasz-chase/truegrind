import { AppColors } from "@/constants/colors";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import { Workout } from "@/types/workout";
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

  const updateActiveWorkout = (newValue: string, name: keyof Workout) => {
    updateWorkoutField(name, newValue);
  };
  return (
    <View style={styles.workoutDetails}>
      <TextInput
        placeholder={"Workout Name"}
        placeholderTextColor={AppColors.gray}
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
        placeholderTextColor={AppColors.gray}
        onChange={(e) => updateActiveWorkout(e.nativeEvent.text, "notes")}
        maxLength={60}
        value={workout?.notes}
        style={styles.workoutNotes}
      />
    </View>
  );
};
const styles = StyleSheet.create({
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
export default WorkoutDetails;
