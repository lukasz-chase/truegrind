import uuid from "react-native-uuid";

export const initialWorkoutState = {
  initialActiveWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "",
    split_id: "",
    workout_exercises: [],
  },
  activeWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "",
    split_id: "",
    workout_exercises: [],
  },
  workoutWasUpdated: false,
  isNewWorkout: false,
  persistedStorage: false,
};
