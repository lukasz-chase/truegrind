import { Workout } from "@/types/workout";
import { supabase } from "./supabase";
import { WorkoutExercise } from "@/types/workoutExercise";
import { ExerciseSet } from "@/types/exercisesSets";
import userStore from "@/store/userStore";
import { UserProfile } from "@/types/user";
import uuid from "react-native-uuid";
import { Exercise } from "@/types/exercises";
import { decode } from "base64-arraybuffer";
import exercisesStore from "@/store/exercisesStore";
import { areObjectsDifferent } from "./helpers";

export const updateWorkout = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutHistoryId: string,
  isNewWorkout: boolean
) => {
  if (
    areObjectsDifferent(activeWorkout, initialActiveWorkout) ||
    isNewWorkout
  ) {
    const { workout_exercises, ...workoutDB } = activeWorkout;
    await supabase
      .from("workouts")
      .upsert(workoutDB)
      .eq("id", activeWorkout.id)
      .select();
  }
  const { workout_exercises, id, ...workoutNotPopulated } = activeWorkout;
  const workoutHistory = {
    ...workoutNotPopulated,
    id: workoutHistoryId,
    created_at: new Date().toISOString(),
  };
  await supabase.from("workout_history").insert(workoutHistory);
};

export const updateWorkoutExercises = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutHistoryId: string,
  workoutExercisesHistoryIds: { id: string; historyId: string }[],
  updateTemplate: boolean
) => {
  const workoutExercisesToUpdate: WorkoutExercise[] = [];
  const workoutExercisesHistoryToCreate: WorkoutExercise[] = [];
  const workoutExercisesToDelete: string[] = [];

  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    const initialExercise = initialActiveWorkout.workout_exercises?.find(
      (ex) => ex.id === workoutExercise.id
    );
    const { exercise_sets, exercises, ...workoutExerciseNotPopulated } =
      workoutExercise;
    workoutExercisesHistoryToCreate.push({
      ...workoutExerciseNotPopulated,
      id: workoutExercisesHistoryIds.find((e) => e.id === workoutExercise.id)!
        .historyId,
      exercise_id: workoutExercise.exercises.id,
      workout_id: workoutHistoryId,
      created_at: new Date().toISOString(),
    });
    if (
      !initialExercise ||
      areObjectsDifferent(workoutExercise, initialExercise)
    ) {
      if ((updateTemplate && !initialExercise) || initialExercise) {
        workoutExercisesToUpdate.push({
          ...workoutExerciseNotPopulated,
          created_at: !initialExercise
            ? new Date().toISOString()
            : (initialExercise as any).created_at,
          exercise_id: workoutExercise.exercises.id,
          workout_id: activeWorkout.id,
        });
      }
    }
  }

  if (updateTemplate) {
    for (const initialWorkoutExercise of initialActiveWorkout.workout_exercises ||
      []) {
      const exists = activeWorkout.workout_exercises?.some(
        (current) => current.id === initialWorkoutExercise.id
      );
      if (!exists) workoutExercisesToDelete.push(initialWorkoutExercise.id);
    }
    if (workoutExercisesToDelete.length > 0) {
      await supabase
        .from("workout_exercises")
        .delete()
        .in("id", workoutExercisesToDelete);
    }

    if (workoutExercisesToUpdate.length > 0) {
      await supabase.from("workout_exercises").upsert(workoutExercisesToUpdate);
    }
  }

  await supabase
    .from("exercises_history")
    .insert(workoutExercisesHistoryToCreate);
};

export const updateExerciseSets = async (
  activeWorkout: Workout,
  initialActiveWorkout: Workout,
  workoutExercisesHistoryIds: { id: string; historyId: string }[]
) => {
  const exerciseSetsToUpdate: ExerciseSet[] = [];
  const exerciseHistorySets: ExerciseSet[] = [];
  const exerciseSetsToDelete: string[] = [];
  const userId = userStore.getState().user?.id;
  for (const workoutExercise of activeWorkout.workout_exercises || []) {
    let order = 1;
    for (const set of workoutExercise.exercise_sets || []) {
      if (set.completed) {
        const setUpdated = {
          ...set,
          created_at: new Date().toISOString(),
          completed: false,
          order: order++,
          workout_exercise_id: workoutExercise.id,
        };
        exerciseSetsToUpdate.push(setUpdated);

        const workoutExerciseHistoricId = workoutExercisesHistoryIds.find(
          (e) => e.id === workoutExercise.id
        )!.historyId;
        const historySet = {
          ...setUpdated,
          id: uuid.v4(),
          workout_exercise_id: workoutExerciseHistoricId,
          exercise_id: workoutExercise.exercises.id,
          user_id: userId,
        };
        exerciseHistorySets.push(historySet);
      }
    }
  }

  for (const initialWorkoutExercise of initialActiveWorkout.workout_exercises ||
    []) {
    for (const initialSet of initialWorkoutExercise.exercise_sets || []) {
      const exists = activeWorkout.workout_exercises?.some(
        (currentWorkoutExercise) =>
          currentWorkoutExercise.exercise_sets.some(
            (currentSet) => currentSet.id === initialSet.id
          )
      );
      if (!exists) exerciseSetsToDelete.push(initialSet.id);
    }
  }

  if (exerciseSetsToUpdate.length > 0) {
    await supabase.from("exercise_sets").upsert(exerciseSetsToUpdate);
    await supabase.from("sets_history").upsert(exerciseHistorySets);
  }
  if (exerciseSetsToDelete.length > 0) {
    await supabase
      .from("exercise_sets")
      .delete()
      .in("id", exerciseSetsToDelete);
  }
};

export const updateUserProfile = async (
  customTimers: number[],
  userId: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ custom_timers: customTimers })
    .eq("id", userId)
    .returns<UserProfile>();
  if (data) {
    userStore.setState({ user: data });
  }
  if (error) {
    console.log("error", error);
  }
};

const getSignedUrl = async (bucketName: string, filePath: string) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 60 * 60 * 24 * 9999);
  if (error) {
    console.log(error);
    return undefined;
  }
  return data.signedUrl;
};

const uploadImageToBucket = async (
  imageBase64: string,
  filePath: string,
  bucketName: string
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, decode(imageBase64), {
        contentType: "image/png",
      });
    if (error) {
      console.log("error", error);
      return undefined;
    }
    if (data) {
      const signedUrl = await getSignedUrl(bucketName, data.path);
      if (signedUrl) {
        return signedUrl;
      }
      return data?.fullPath;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const upsertExercise = async ({
  exercise,
  imageWasChanged,
  imageExtension,
}: {
  exercise: Partial<Exercise>;
  imageWasChanged: boolean;
  imageExtension?: string | undefined;
}) => {
  if (exercise.image && imageWasChanged) {
    const imageUrl = await uploadImageToBucket(
      exercise.image,
      `${exercise.muscle}/${exercise.name}.${imageExtension}`,
      "exercises"
    );
    if (imageUrl) {
      exercise = { ...exercise, image: imageUrl };
    }
  }
  const { data, error } = await supabase
    .from("exercises")
    .upsert(exercise)
    .select()
    .returns<Exercise[]>();

  if (data && !exercise.id) {
    exercisesStore.getState().addExercise(data[0]);
    return data[0];
  } else if (data && exercise.id) {
    exercisesStore.getState().replaceExercise(exercise as Exercise);
    return exercise as Exercise;
  }
  if (error) {
    console.log("error", error);
    return undefined;
  }
};

export const deleteWorkout = async (workoutId: string) => {
  await supabase.from("workouts").delete().eq("id", workoutId);
};

export const deleteExercise = async (
  exerciseId: string,
  CustomImage?: string
) => {
  if (CustomImage) {
    const pathAfterBucket = CustomImage.split("exercises/")[1].split("?")[0];
    // Decode the URL-encoded segments
    const filePath = decodeURIComponent(pathAfterBucket);
    await supabase.storage.from("exercises").remove([filePath]);
  }
  await supabase.from("exercises").delete().eq("id", exerciseId);
  exercisesStore.getState().deleteExercise(exerciseId);
};
