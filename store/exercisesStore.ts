import { Exercise } from "@/types/exercises";
import { create } from "zustand";

type Store = {
  exercises: Exercise[];
  frequentExercises: Exercise[];
  recentExercises: Exercise[];
  setExercises: (
    exercises: Exercise[],
    frequentExercises?: Exercise[],
    recentExercises?: Exercise[]
  ) => void;
  addExercise: (exercise: Exercise) => void;
  replaceExercise: (newExercise: Exercise) => void;
  deleteExercise: (exerciseId: string) => void;
};

const exercisesStore = create<Store>((set) => ({
  exercises: [],
  frequentExercises: [],
  recentExercises: [],
  setExercises: (exercises, frequentExercises, recentExercises) =>
    set({ exercises, frequentExercises, recentExercises }),
  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),
  replaceExercise: (newExercise: Exercise) => {
    set((state) => ({
      exercises: state.exercises.map((exercise) =>
        exercise.id === newExercise.id ? newExercise : exercise
      ),
    }));
  },
  deleteExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      ),
    })),
}));

export default exercisesStore;
