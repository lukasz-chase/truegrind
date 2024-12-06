import { Exercise } from "@/types/exercises";
import { create } from "zustand";

type Store = {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Exercise) => void;
};

const exercisesStore = create<Store>((set) => ({
  exercises: [],
  setExercises: (exercises) => set({ exercises }),
  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),
}));

export default exercisesStore;
