import { create } from "zustand";
import { Workout } from "@/types/workout";
import { ExerciseSet } from "@/types/exercisesSets";

interface ActiveWorkoutStore {
  activeWorkout: Workout;
  setActiveWorkout: (workout: Workout) => void;
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => void;
  addNewSet: (exerciseId: number, newSet: ExerciseSet) => void;
}

const useActiveWorkout = create<ActiveWorkoutStore>((set, get) => ({
  activeWorkout: {
    id: 0,
    name: "New workout",
    user_id: "0",
    workout_exercises: [],
  },
  setActiveWorkout: (workout: Workout) => set({ activeWorkout: workout }),
  updateWorkoutField: (field: keyof Workout, updatedValue: any) => {
    const oldWorkout = get().activeWorkout;
    set({ activeWorkout: { ...oldWorkout, [field]: updatedValue } });
  },
  addNewSet: (exerciseId: number, newSet: ExerciseSet) => {
    console.log(exerciseId);
    const oldWorkout = get().activeWorkout;

    if (!oldWorkout.workout_exercises) return;
    console.log(oldWorkout.workout_exercises);
    const updatedExercises = oldWorkout.workout_exercises.map((exercise) => {
      console.log(exercise.id);
      // console.log(exerciseId);
      if (exercise.exercises.id === exerciseId) {
        console.log("found exercise");
        return {
          ...exercise,
          exercise_sets: [
            ...(exercise.exercise_sets || []),
            {
              ...newSet,
              workout_exercise_id: exercise.id,
            },
          ],
        };
      }
      // console.log(exercise);
      return exercise;
    });
    // console.log(updatedExercises);

    set({
      activeWorkout: {
        ...oldWorkout,
        workout_exercises: updatedExercises,
      },
    });
  },
}));

export default useActiveWorkout;
