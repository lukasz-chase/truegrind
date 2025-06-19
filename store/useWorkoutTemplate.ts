import { create } from "zustand";
import { Workout } from "@/types/workout";
import { ExerciseSet } from "@/types/exercisesSets";
import uuid from "react-native-uuid";
import { Exercise } from "@/types/exercises";
import {
  WorkoutExercise,
  WorkoutExercisePopulated,
} from "@/types/workoutExercise";
import { getHistoryExerciseData } from "@/lib/exercisesService";
import userStore from "./userStore";
import { INITIAL_WORKOUT_STATE } from "@/constants/initialState";

interface TemplateWorkoutStore {
  initialWorkout: Workout;
  workout: Workout;
  workoutWasUpdated: boolean;
  isNewWorkout: boolean;
  setIsNewWorkout: (value: boolean) => void;
  setWorkout: (
    workout: Workout,
    clearSets?: boolean,
    updateInitialWorkout?: boolean
  ) => void;
  addNewWorkoutExercise: (
    exercise: Exercise,
    newExerciseProperties?: Partial<WorkoutExercise>
  ) => Promise<void>;
  updateWorkoutExerciseField: (
    workoutExerciseId: string,
    propertiesToUpdate: Partial<WorkoutExercise>
  ) => void;
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => void;
  addNewSet: (exerciseId: string) => void;
  updateExerciseSet: (
    exerciseId: string,
    setId: string,
    propertiesToUpdate: Partial<ExerciseSet>
  ) => void;
  deleteExerciseSet: (exerciseId: string, setId: string) => void;
  removeWorkoutExercise: (exerciseId: string) => void;
  replaceWorkoutExercise: (
    exerciseId: string,
    newExercise: Exercise,
    userId: string
  ) => Promise<void>;
  reorderWorkoutExercises: (newOrder: string[]) => void;
  resetWorkout: () => void;
}

const useWorkoutTemplate = create<TemplateWorkoutStore>()((set, get) => ({
  initialWorkout: INITIAL_WORKOUT_STATE.initialActiveWorkout,
  workout: INITIAL_WORKOUT_STATE.activeWorkout,
  workoutWasUpdated: INITIAL_WORKOUT_STATE.workoutWasUpdated,
  isNewWorkout: INITIAL_WORKOUT_STATE.isNewWorkout,
  setIsNewWorkout: (value: boolean) => set({ isNewWorkout: value }),
  setWorkout: (workout, clearSets = true, updateInitialWorkout = true) => {
    if (clearSets) {
      const clearedWorkoutSets = workout.workout_exercises?.map(
        (workoutExercise) => ({
          ...workoutExercise,
          exercise_sets: workoutExercise.exercise_sets?.map((set) => ({
            ...set,
            partials: null,
            completed: false,
            is_dropset: false,
            is_warmup: false,
            reps: null,
            weight: null,
            rpe: null,
            bar_type: null,
          })),
        })
      );
      if (updateInitialWorkout) {
        set({
          workout: {
            ...workout,
            workout_exercises: clearedWorkoutSets,
          },
          initialWorkout: workout,
        });
      } else {
        set({
          workout: {
            ...workout,
            workout_exercises: clearedWorkoutSets,
          },
        });
      }
    } else {
      if (updateInitialWorkout) {
        set({
          workout,
        });
      } else {
        set({
          workout,
          initialWorkout: workout,
        });
      }
    }
  },
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => {
    set((state) => ({
      workout: { ...state.workout, [field]: updatedValue },
      workoutWasUpdated: true,
    }));
  },
  updateWorkoutExerciseField: (workoutExerciseId, propertiesToUpdate) => {
    set((state) => ({
      workout: {
        ...state.workout,
        workout_exercises: state.workout.workout_exercises?.map(
          (workoutExercise) => {
            if (workoutExercise.id === workoutExerciseId) {
              return { ...workoutExercise, ...propertiesToUpdate };
            }
            return workoutExercise;
          }
        ),
      },
    }));
  },
  addNewWorkoutExercise: async (exercise, newExerciseProperties) => {
    const { user } = userStore.getState();
    if (!user?.id) return;
    const data = await getHistoryExerciseData(exercise.id, user.id);
    if (data) {
      newExerciseProperties = { ...newExerciseProperties, ...data };
    }
    const newExercise: WorkoutExercisePopulated = {
      id: uuid.v4(),
      note: { noteValue: "", showNote: false },
      order: (get().workout.workout_exercises?.length ?? 0) + 1,
      timer: null,
      warmup_timer: null,
      exercises: exercise,
      exercise_sets: [],
      superset: null,
      user_id: user.id,
      ...newExerciseProperties,
    };

    set((state) => {
      const updatedExercises = [
        ...(state.workout.workout_exercises || []),
        newExercise,
      ];

      return {
        workout: {
          ...state.workout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
      };
    });
    get().addNewSet(newExercise.id);
  },
  replaceWorkoutExercise: async (
    workoutExerciseId: string,
    newExercise: Exercise
  ) => {
    const { user } = userStore.getState();
    if (!user?.id) return;
    let newWorkoutExercise: WorkoutExercisePopulated = {
      id: uuid.v4(),
      note: { noteValue: "", showNote: false },
      timer: null,
      warmup_timer: null,
      exercises: newExercise,
      exercise_sets: [],
      superset: null,
      order: 1,
      user_id: user.id,
    };
    const data = await getHistoryExerciseData(newExercise.id, user.id);
    if (data) {
      newWorkoutExercise = { ...newWorkoutExercise, ...data };
    }
    set((state) => ({
      workout: {
        ...state.workout,
        workout_exercises: state.workout.workout_exercises?.map(
          (workoutExercise) => {
            if (workoutExercise.id === workoutExerciseId) {
              return {
                ...newWorkoutExercise,
                order: workoutExercise.order,
              };
            }
            return workoutExercise;
          }
        ),
      },
      workoutWasUpdated: true,
    }));
    get().addNewSet(newWorkoutExercise.id);
  },
  addNewSet: (workoutExerciseId) => {
    const { user } = userStore.getState();
    if (!user?.id) return;
    set((state) => {
      const updatedExercises = state.workout.workout_exercises?.map(
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
                  rpe: null,
                  completed: false,
                  partials: null,
                  user_id: user.id,
                  bar_type: null,
                },
              ],
            };

          return workoutExercise;
        }
      );
      return {
        workout: {
          ...state.workout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
      };
    });
  },
  updateExerciseSet: (
    exerciseId: string,
    setId: string,
    propertiesToUpdate: Partial<ExerciseSet>
  ) => {
    set((state) => {
      const updatedExercises = state.workout.workout_exercises?.map(
        (exercise) =>
          exercise.exercises.id === exerciseId
            ? {
                ...exercise,
                exercise_sets: exercise.exercise_sets.map((set) =>
                  set.id === setId ? { ...set, ...propertiesToUpdate } : set
                ),
              }
            : exercise
      );
      return {
        workout: {
          ...state.workout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
      };
    });
  },
  deleteExerciseSet: (exerciseId: string, setId: string) => {
    set((state) => {
      const updatedExercises = state.workout.workout_exercises?.map(
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
        workout: {
          ...state.workout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
      };
    });
  },
  removeWorkoutExercise: (workoutExerciseId: string) => {
    set((state) => {
      const updatedExercises = state.workout.workout_exercises?.filter(
        (workoutExercise) => workoutExercise.id !== workoutExerciseId
      );

      return {
        workout: {
          ...state.workout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
      };
    });
  },
  reorderWorkoutExercises: (newOrder: string[]) => {
    set((state) => {
      const currentExercises = state.workout.workout_exercises || [];

      const updatedExercises = newOrder.map((id, index) => {
        const exercise = currentExercises.find(
          (exercise) => exercise.id === id
        );
        if (!exercise) return currentExercises[index];
        return {
          ...exercise,
          order: index + 1,
        };
      });
      return {
        workout: {
          ...state.workout,
          workout_exercises: updatedExercises,
        },
        workoutWasUpdated: true,
      };
    });
  },
  resetWorkout: () =>
    set({
      initialWorkout: INITIAL_WORKOUT_STATE.initialActiveWorkout,
      workout: INITIAL_WORKOUT_STATE.activeWorkout,
      isNewWorkout: INITIAL_WORKOUT_STATE.isNewWorkout,
      workoutWasUpdated: INITIAL_WORKOUT_STATE.workoutWasUpdated,
    }),
}));

export default useWorkoutTemplate;
