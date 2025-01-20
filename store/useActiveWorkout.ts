import { create } from "zustand";
import { Workout } from "@/types/workout";
import { ExerciseSet } from "@/types/exercisesSets";
import uuid from "react-native-uuid";
import { Exercise } from "@/types/exercises";
import {
  WorkoutExercise,
  WorkoutExercisePopulated,
} from "@/types/workoutExercise";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { getExerciseTimers } from "@/lib/exercisesService";

const initialState = {
  initialActiveWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "",
    workout_exercises: [],
  },
  activeWorkout: {
    id: uuid.v4(),
    name: "New workout",
    user_id: "",
    workout_exercises: [],
  },
  workoutWasUpdated: false,
  isNewWorkout: false,
  persistedStorage: false,
};

interface ActiveWorkoutStore {
  initialActiveWorkout: Workout;
  activeWorkout: Workout;
  workoutWasUpdated: boolean;
  isNewWorkout: boolean;
  persistedStorage: boolean;
  setIsNewWorkout: (value: boolean) => void;
  setActiveWorkout: (
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
    newExercise: Exercise
  ) => Promise<void>;
  reorderWorkoutExercises: (newOrder: string[]) => void;
  resetActiveWorkout: () => void;
  setPersistedStorage: (value: boolean) => void;
}

const useActiveWorkout = create<ActiveWorkoutStore>()(
  persist(
    (set, get) => ({
      initialActiveWorkout: initialState.initialActiveWorkout,
      activeWorkout: initialState.activeWorkout,
      workoutWasUpdated: initialState.workoutWasUpdated,
      isNewWorkout: initialState.isNewWorkout,
      persistedStorage: initialState.persistedStorage,
      setIsNewWorkout: (value: boolean) => set({ isNewWorkout: value }),
      setActiveWorkout: (
        workout,
        clearSets = true,
        updateInitialWorkout = true
      ) => {
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
              })),
            })
          );
          if (updateInitialWorkout) {
            set({
              activeWorkout: {
                ...workout,
                workout_exercises: clearedWorkoutSets,
              },
              initialActiveWorkout: workout,
            });
          } else {
            set({
              activeWorkout: {
                ...workout,
                workout_exercises: clearedWorkoutSets,
              },
            });
          }
        } else {
          if (updateInitialWorkout) {
            set({
              activeWorkout: workout,
            });
          } else {
            set({
              activeWorkout: workout,
              initialActiveWorkout: workout,
            });
          }
        }
      },
      updateWorkoutField: (field: keyof Workout, updatedValue: any) => {
        set((state) => ({
          activeWorkout: { ...state.activeWorkout, [field]: updatedValue },
          workoutWasUpdated: true,
        }));
      },
      updateWorkoutExerciseField: (workoutExerciseId, propertiesToUpdate) => {
        set((state) => ({
          activeWorkout: {
            ...state.activeWorkout,
            workout_exercises: state.activeWorkout.workout_exercises?.map(
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
        const timers = await getExerciseTimers(exercise.id);
        if (timers) {
          newExerciseProperties = { ...newExerciseProperties, ...timers };
        }
        const newExercise: WorkoutExercisePopulated = {
          id: uuid.v4(),
          note: { noteValue: "", showNote: false },
          order: (get().activeWorkout.workout_exercises?.length ?? 0) + 1,
          timer: null,
          warmup_timer: null,
          exercises: exercise,
          exercise_sets: [],
          superset: null,
          ...newExerciseProperties,
        };

        set((state) => {
          const updatedExercises = [
            ...(state.activeWorkout.workout_exercises || []),
            newExercise,
          ];

          return {
            activeWorkout: {
              ...state.activeWorkout,
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
        let newWorkoutExercise: WorkoutExercisePopulated = {
          id: uuid.v4(),
          note: { noteValue: "", showNote: false },
          timer: null,
          warmup_timer: null,
          exercises: newExercise,
          exercise_sets: [],
          superset: null,
          order: 1,
        };
        const timers = await getExerciseTimers(newExercise.id);
        if (timers) {
          newWorkoutExercise = { ...newWorkoutExercise, ...timers };
        }
        set((state) => ({
          activeWorkout: {
            ...state.activeWorkout,
            workout_exercises: state.activeWorkout.workout_exercises?.map(
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
                      rpe: null,
                      completed: false,
                      partials: null,
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
        propertiesToUpdate: Partial<ExerciseSet>
      ) => {
        set((state) => {
          const updatedExercises = state.activeWorkout.workout_exercises?.map(
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
      removeWorkoutExercise: (workoutExerciseId: string) => {
        set((state) => {
          const updatedExercises =
            state.activeWorkout.workout_exercises?.filter(
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
      reorderWorkoutExercises: (newOrder: string[]) => {
        set((state) => {
          const currentExercises = state.activeWorkout.workout_exercises || [];

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
            activeWorkout: {
              ...state.activeWorkout,
              workout_exercises: updatedExercises,
            },
            workoutWasUpdated: true,
          };
        });
      },
      resetActiveWorkout: () => set(initialState),
      setPersistedStorage: (value: boolean) => set({ persistedStorage: value }),
    }),
    {
      name: "active-workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        initialActiveWorkout: state.initialActiveWorkout,
        activeWorkout: state.activeWorkout,
        workoutWasUpdated: state.workoutWasUpdated,
        isNewWorkout: state.isNewWorkout,
        persistedStorage: true,
      }),
    }
  )
);

export default useActiveWorkout;
