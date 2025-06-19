import uuid from "react-native-uuid";

export const INITIAL_WORKOUT_STATE = {
  initialActiveWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "",
    split_id: "",
    workout_exercises: [],
    order: null,
    folder_id: null,
  },
  activeWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "",
    split_id: "",
    workout_exercises: [],
    order: null,
    folder_id: null,
  },
  workoutWasUpdated: false,
  isNewWorkout: false,
  persistedStorage: false,
};

export const INITIAL_FOLDER_NAME = "Uncollected";
