import { AppColors } from "@/constants/colors";
import useActiveWorkout from "@/store/useActiveWorkout";
import useWorkoutTimer from "@/store/useWorkoutTimer";
import { Workout } from "@/types/workout";
import { StyleSheet, Text, TextInput, View } from "react-native";

const WorkoutDetails = () => {
  const { activeWorkout, updateWorkoutField } = useActiveWorkout();
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
        value={activeWorkout.name}
        style={styles.workoutName}
      />
      <Text style={styles.workoutTime}>{formattedTime}</Text>
      <TextInput
        placeholder={"Notes"}
        placeholderTextColor={AppColors.gray}
        onChange={(e) => updateActiveWorkout(e.nativeEvent.text, "notes")}
        maxLength={60}
        value={activeWorkout?.notes}
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
