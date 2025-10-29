import { fetchHighestWeightSet } from "@/lib/exerciseSetsService";
import { WorkoutExercisePopulated } from "@/types/workoutExercise";

export const calculatePRs = async (
  workoutExercises: WorkoutExercisePopulated[]
): Promise<number> => {
  if (!workoutExercises || workoutExercises.length === 0) {
    return 0;
  }

  const prPromises = workoutExercises.map(async (workoutExercise) => {
    const highestWeight = workoutExercise.exercise_sets.reduce(
      (max, set) => Math.max(max, set.weight ?? 0),
      0
    );

    if (highestWeight === 0) return 0;

    const { data, error } = await fetchHighestWeightSet(
      workoutExercise.exercises.id,
      highestWeight
    );

    if (error) return 0;
    return data && data.length === 0 ? 1 : 0;
  });

  const prResults = await Promise.all(prPromises);
  return prResults.reduce((sum, pr) => sum + pr, 0);
};
