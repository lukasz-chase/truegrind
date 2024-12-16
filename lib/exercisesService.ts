import { Exercise } from "@/types/exercises";
import { supabase } from "./supabase";

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
export const getRecentExercises = async () => {
  const { data, error } = await supabase
    .from("exercises_history")
    .select("created_at, exercises!inner(*)")
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
export const getExercises = async () => {
  const { data, error } = await supabase
    .from("exercises")
    .select("*, exercises_history_count:exercises_history(count)")
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
