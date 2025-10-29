import { User } from "@/types/user";

const WEIGHTLIFTING_MET = 4.5; // Metabolic Equivalent of Task for weightlifting (average)

export const estimateCaloriesBurned = (
  duration: string,
  user: User | null
): number => {
  if (!user?.weight || !duration) {
    return 0;
  }

  const [minutes, seconds] = duration.split(":").map(Number);
  const durationInHours = minutes / 60 + seconds / 3600;

  const calories = WEIGHTLIFTING_MET * user.weight * durationInHours;
  return Math.round(calories);
};
