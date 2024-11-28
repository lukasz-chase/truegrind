import { create } from "zustand";
import { Workout } from "@/types/workout";
import { ExerciseSet } from "@/types/exercisesSets";
import uuid from "react-native-uuid";
import { Exercise } from "@/types/exercises";
import useTimerStore from "./useTimer";

interface ActiveWorkoutStore {
  initialActiveWorkout: Workout;
  activeWorkout: Workout;
  workoutWasUpdated: boolean;
  setActiveWorkout: (workout: Workout) => void;
  addNewExercise: (exercise: Exercise) => void;
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => void;
  addNewSet: (exerciseId: string) => void;
  updateExerciseSet: (
    exerciseId: string,
    setId: string,
    fieldName: keyof ExerciseSet,
    value: any
  ) => void;
  deleteExerciseSet: (exerciseId: string, setId: string) => void;
  removeExercise: (exerciseId: string) => void;
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
  workoutWasUpdated: false,
  setActiveWorkout: (workout: Workout) => {
    const { endTimer } = useTimerStore.getState(); // Access the timer store's actions
    endTimer(); // Call the endTimer function from the timer store
    set({ activeWorkout: workout, initialActiveWorkout: workout });
  },

  updateWorkoutField: (field: keyof Workout, updatedValue: any) => {
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, [field]: updatedValue },
      workoutWasUpdated: true,
    }));
  },
  addNewExercise: (exercise: Exercise) => {
    const workoutExercise = {
      id: uuid.v4(),
      notes: "",
      order: (get().activeWorkout.workout_exercises?.length ?? 0) + 1,
      timer: 0,
      exercises: exercise,
      exercise_sets: [],
    };
    set((state) => ({
      activeWorkout: {
        ...state.activeWorkout,
        workout_exercises: [
          ...(state.activeWorkout.workout_exercises || []),
          workoutExercise,
        ],
      },
      workoutWasUpdated: true,
    }));
    get().addNewSet(workoutExercise.id);
  },
  addNewSet: (workoutExerciseId: string) => {
    set((state) => {
      const updatedExercises = state.activeWorkout.workout_exercises?.map(
        (workoutExercise) => {
          if (workoutExercise.id === workoutExerciseId)
            return {
              ...workoutExercise,
              exercise_sets: [
                ...(workoutExercise.exercise_sets || []),
                {
                  id: uuid.v4(),
                  workout_exercise_id: workoutExercise.id,
                  order: workoutExercise.exercise_sets.length + 1,
                  reps: null,
                  weight: null,
                  is_warmup: false,
                  is_dropset: false,
                  reps_in_reserve: null,
                  completed: false,
                },
              ],
            };

          return workoutExercise;
        }
      );
      return {
        activeWorkout: {
          ...state.activeWorkout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
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
        workoutWasUpdated: true,
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
        workoutWasUpdated: true,
      };
    });
  },
  removeExercise: (workoutExerciseId: string) => {
    set((state) => {
      const updatedExercises = state.activeWorkout.workout_exercises?.filter(
        (workoutExercise) => workoutExercise.id !== workoutExerciseId
      );

      return {
        activeWorkout: {
          ...state.activeWorkout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
      };
    });
  },
}));

export default useActiveWorkout;
