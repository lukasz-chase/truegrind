import { Exercise } from "@/types/exercises";
import { supabase } from "./supabase";
import { ExerciseSet } from "@/types/exercisesSets";
import { MetricsData } from "@/types/workoutMetrics";

export const groupExercisesByAlphabet = (exercises: Exercise[]) => {
  const grouped = exercises.reduce((acc, exercise) => {
    const firstLetter = exercise.name.charAt(0)?.toUpperCase() ?? "#";
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return Object.keys(grouped)
    .sort()
    .map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));
};
export const getRecentExercises = async (userId: string) => {
  const { data, error } = await supabase
    .from("exercises_history")
    .select("created_at, exercises!inner(*)")
    .or(`user_id.eq.${userId},user_id.is.null`, { foreignTable: "exercises" })
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<{ created_at: string; exercises: Exercise }[]>();

  if (error) {
    console.error("Error fetching recent exercises:", error);
    return;
  }

  if (data) {
    const mapped = data.map((row) => row.exercises) as Exercise[];
    return mapped;
  }
};
export const getExercises = async (userId: string) => {
  const { data, error } = await supabase
    .from("exercises")
    .select("*, exercises_history_count:exercises_history(count)")
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order("name", { ascending: true })
    .returns<
      (Exercise & {
        exercises_history_count: { count: number }[];
      })[]
    >();

  if (error) {
    console.error("Error fetching exercises:", error);
    return;
  }
  if (!data) return;

  const baseExercises = [...data].map((exercise) => {
    const { exercises_history_count, ...baseExercise } = exercise;
    return baseExercise;
  });

  const mostFrequentExercises = [...data]
    .sort(
      (a, b) =>
        b.exercises_history_count[0].count - a.exercises_history_count[0].count
    )
    .slice(0, 5);
  return {
    baseExercises,
    mostFrequentExercises,
  };
};
export const getExercise = async (exerciseId: string) => {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", exerciseId)
    .returns<Exercise>();

  if (error) {
    console.error("Error fetching exercises:", error);
    return;
  }
  if (!data) return;
  return data;
};

export const getExerciseData = async (exerciseId: string, userId: string) => {
  const { data, error } = await supabase
    .from("workout_history")
    .select(
      "name, created_at, exercises_history!inner(id, sets_history!inner(*))"
    )
    .eq("exercises_history.sets_history.exercise_id", exerciseId)
    .eq("exercises_history.sets_history.user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return;
  }

  if (data) {
    return data;
  }
};
export const calculateMetrics = (data: any): MetricsData => {
  let oneRMRecord = { value: 0, date: "" };
  let weightRecord = { weight: 0, reps: 0, date: "" };
  let volumeRecord = { weight: 0, reps: 0, totalVolume: 0, date: "" };

  const metrics = data.map((workout: any) => {
    let highestOneRepMax = { value: 0, date: "" };
    let highestWeightSet = { weight: 0, reps: 0 };
    let highestVolumeSet = { weight: 0, reps: 0, totalVolume: 0 };
    let maxConsecutiveReps = 0;

    const exercisesMetrics = workout.exercises_history.map((exercise: any) => {
      const setsMetrics = exercise.sets_history.map((set: ExerciseSet) => {
        if (!set.weight || !set.reps) return set;

        // Calculate metrics for the set
        const oneRepMax = set.weight * (1 + set.reps / 30); // Epley formula
        const totalVolume = set.weight * set.reps;

        // Update the overall metrics
        if (oneRepMax > highestOneRepMax.value)
          highestOneRepMax = {
            value: oneRepMax, // Keep the precise value for now
            date: workout.created_at,
          };
        if (set.weight > highestWeightSet.weight) {
          highestWeightSet = { weight: set.weight, reps: set.reps };
        }
        if (totalVolume > highestVolumeSet.totalVolume) {
          highestVolumeSet = {
            weight: set.weight,
            reps: set.reps,
            totalVolume,
          };
        }
        if (set.reps > maxConsecutiveReps) maxConsecutiveReps = set.reps;

        return {
          ...set,
          oneRepMax: Math.round(oneRepMax),
          totalVolume,
        };
      });

      return {
        exerciseId: exercise.id,
        setsMetrics,
      };
    });

    if (highestOneRepMax.value > oneRMRecord.value)
      oneRMRecord = {
        value: Math.round(highestOneRepMax.value),
        date: highestOneRepMax.date,
      };
    if (highestWeightSet.weight > weightRecord.weight)
      weightRecord = { ...highestWeightSet, date: workout.created_at };
    if (highestVolumeSet.totalVolume > volumeRecord.totalVolume)
      volumeRecord = { ...highestVolumeSet, date: workout.created_at };

    return {
      workoutName: workout.name,
      workoutDate: workout.created_at,
      exercisesMetrics,
      highestOneRepMax: {
        ...highestOneRepMax,
        value: Math.round(highestOneRepMax.value),
      },
      highestWeightSet,
      highestVolumeSet,
      maxConsecutiveReps,
    };
  });

  return { history: metrics, oneRMRecord, weightRecord, volumeRecord };
};

export const getHistoryExerciseData = async (exerciseId: string) => {
  const { data, error } = await supabase
    .from("exercises_history")
    .select("timer, warmup_timer, note")
    .eq("exercise_id", exerciseId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single<{
      timer: number;
      warmup_timer: number;
      note: { noteValue: string; showNote: boolean };
    }>();
  if (error) console.log(error);
  if (data) return data;
  else return null;
};
