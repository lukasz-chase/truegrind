import { create } from "zustand";
import { Workout } from "@/types/workout";
import { ExerciseSet } from "@/types/exercisesSets";
import uuid from "react-native-uuid";

interface ActiveWorkoutStore {
  initialActiveWorkout: Workout;
  activeWorkout: Workout;
  setActiveWorkout: (workout: Workout) => void;
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => void;
  addNewSet: (exerciseId: string) => void;
  updateExerciseSet: (
    exerciseId: string,
    setId: string,
    fieldName: keyof ExerciseSet,
    value: any
  ) => void;
  deleteExerciseSet: (exerciseId: string, setId: string) => void;
}

const useActiveWorkout = create<ActiveWorkoutStore>((set, get) => ({
  initialActiveWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "0",
    workout_exercises: [],
  },
  activeWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "0",
    workout_exercises: [],
  },
  setActiveWorkout: (workout: Workout) =>
    set({ activeWorkout: workout, initialActiveWorkout: workout }),
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => {
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, [field]: updatedValue },
    }));
  },
  addNewSet: (exerciseId: string) => {
    set((state) => {
      const updatedExercises = state.activeWorkout.workout_exercises?.map(
        (exercise) =>
          exercise.exercises.id === exerciseId
            ? {
                ...exercise,
                exercise_sets: [
                  ...(exercise.exercise_sets || []),
                  {
                    id: uuid.v4(),
                    workout_exercise_id: exercise.id,
                    order: exercise.exercise_sets.length + 1,
                    reps: null,
                    weight: null,
                    is_warmup: false,
                    is_dropset: false,
                    reps_in_reserve: null,
                  },
                ],
              }
            : exercise
      );
      return {
        activeWorkout: {
          ...state.activeWorkout,
          workout_exercises: updatedExercises,
        },
      };
    });
  },
  updateExerciseSet: (
    exerciseId: string,
    setId: string,
    fieldName: keyof ExerciseSet,
    value: any
  ) => {
    set((state) => {
      const updatedExercises = state.activeWorkout.workout_exercises?.map(
        (exercise) =>
          exercise.exercises.id === exerciseId
            ? {
                ...exercise,
                exercise_sets: exercise.exercise_sets.map((set) =>
                  set.id === setId ? { ...set, [fieldName]: value } : set
                ),
              }
            : exercise
      );
      return {
        activeWorkout: {
          ...state.activeWorkout,
          workout_exercises: updatedExercises,
        },
      };
    });
  },
  deleteExerciseSet: (exerciseId: string, setId: string) => {
    set((state) => {
      const updatedExercises = state.activeWorkout.workout_exercises?.map(
        (exercise) =>
          exercise.exercises.id === exerciseId
            ? {
                ...exercise,
                exercise_sets: exercise.exercise_sets
                  .filter((set) => set.id !== setId) // Remove the set with the given ID
                  .map((set, index) => ({
                    ...set,
                    order: index + 1, // Reassign order to be sequential
                  })),
              }
            : exercise
      );

      return {
        activeWorkout: {
          ...state.activeWorkout,
          workout_exercises: updatedExercises,
        },
      };
    });
  },
}));

export default useActiveWorkout;
