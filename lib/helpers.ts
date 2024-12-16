import { Exercise } from "@/types/exercises";

export const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

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
