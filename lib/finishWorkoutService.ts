import { createWorkoutHistory, updateWorkout } from "@/lib/workoutServices";
import {
  createWorkoutExercisesHistory,
  updateWorkoutExercises,
} from "@/lib/workoutExerciseServices";
import {
  createExerciseSetsHistory,
  updateExerciseSets,
} from "@/lib/exerciseSetsService";
import {
  fetchUserWorkoutCalendar,
  upsertWorkoutCalendar,
} from "@/lib/workoutCalendarService";
import { WorkoutCalendarStatusEnum } from "@/types/workoutCalendar";
import { generateNewColor } from "@/utils/colors";
import { getCalendarDateFormat } from "@/utils/calendar";
import { supabase } from "@/lib/supabase";
import uuid from "react-native-uuid";
import { Workout } from "@/types/workout";
import { User } from "@/types/user";

interface FinishWorkoutParams {
  activeWorkout: Workout;
  initialActiveWorkout: Workout;
  isNewWorkout: boolean;
  updateTemplate: boolean;
  formattedTime: string;
  caloriesBurned: number;
  PRs: number;
  user: User;
}

export const finishWorkout = async ({
  activeWorkout,
  initialActiveWorkout,
  isNewWorkout,
  updateTemplate,
  formattedTime,
  caloriesBurned,
  PRs,
  user,
}: FinishWorkoutParams) => {
  const workoutHistoryId = uuid.v4() as string;

  // 1. Update or create workout template
  await updateWorkout(
    activeWorkout,
    initialActiveWorkout,
    isNewWorkout,
    updateTemplate
  );

  // 2. Create history records
  await createWorkoutHistory(activeWorkout, workoutHistoryId, formattedTime);

  const workoutExercisesHistoryIds =
    activeWorkout.workout_exercises?.map((workoutExercise) => ({
      historyId: uuid.v4() as string,
      id: workoutExercise.id,
    })) ?? [];

  await updateWorkoutExercises(
    activeWorkout,
    initialActiveWorkout,
    updateTemplate
  );
  await createWorkoutExercisesHistory(
    activeWorkout,
    workoutHistoryId,
    workoutExercisesHistoryIds
  );
  await updateExerciseSets(activeWorkout, initialActiveWorkout);
  await createExerciseSetsHistory(activeWorkout, workoutExercisesHistoryIds);

  // 3. Update workout calendar
  const userCalendarWorkouts = await fetchUserWorkoutCalendar(
    activeWorkout.user_id,
    new Date().getMonth() + 1
  );
  const currentColors = userCalendarWorkouts.map((data) => data.color);
  const workoutCalendar = userCalendarWorkouts.find(
    (workout) => workout.workout_id === activeWorkout.id
  );
  const color = workoutCalendar
    ? workoutCalendar.color
    : generateNewColor(currentColors);

  const [minutes, seconds] = formattedTime.split(":").map(Number);
  const now = new Date();
  const startTime = new Date(now.getTime() - (minutes * 60 + seconds) * 1000);

  await upsertWorkoutCalendar({
    status: WorkoutCalendarStatusEnum.Completed,
    user_id: activeWorkout.user_id,
    scheduled_date: getCalendarDateFormat(),
    workout_id: activeWorkout.id,
    color,
    start_time: startTime,
    end_time: now,
    workout_history_id: workoutHistoryId,
  });

  // 4. Upload to Strava (if integrated)
  const { data: stravaIntegration } = await supabase
    .from("strava_integrations")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (stravaIntegration) {
    await supabase.functions.invoke("strava-upload", {
      body: {
        userId: user.id,
        workout: activeWorkout,
        startTime,
        caloriesBurned,
        PRs,
      },
    });
  }
};
