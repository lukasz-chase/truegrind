import { WorkoutsFolder, WorkoutsFolderPopulated } from "@/types/folders";
import { supabase } from "./supabase";
import { INITIAL_FOLDER_NAME } from "@/constants/initialState";
import { updateWorkoutsBulk } from "./workoutServices";
import userStore from "@/store/userStore";

export const fetchUserFoldersWithWorkouts = async (
  userId: string,
  splitId: string,
) => {
  const { data, error } = await supabase
    .from("folders")
    .select(
      `*, workouts(*, workout_exercises(*, exercises(*), exercise_sets(*)))`,
    )
    .eq("split_id", splitId)
    .eq("user_id", userId)
    .order("order", { ascending: true })
    .order("order", { referencedTable: "workouts", ascending: true });

  if (data) {
    return data as WorkoutsFolderPopulated[];
  }
  if (error) {
    console.log(error);
  }
};
export const createFolder = async (folderData: Partial<WorkoutsFolder>) => {
  const { data, error } = await supabase
    .from("folders")
    .insert(folderData)
    .select(
      `*, workouts(*, 
         workout_exercises(
           *, 
           exercises(*), 
           exercise_sets(*)
         )
       )`,
    )
    .single();

  if (error) {
    console.error("Supabase error on createFolder:", error);
    return null;
  }

  return data as WorkoutsFolderPopulated;
};
export const getInitialFolderId = async (userId: string, splitId: string) => {
  try {
    const { data, error } = await supabase
      .from("folders")
      .select("id")
      .eq("user_id", userId)
      .eq("split_id", splitId)
      .eq("name", INITIAL_FOLDER_NAME)
      .limit(1)
      .single();

    if (data && data.id) {
      return data.id;
    } else {
      const folder = await createFolder({
        name: INITIAL_FOLDER_NAME,
        split_id: splitId,
        user_id: userId,
        order: null,
      });
      if (folder) return folder.id;
    }
  } catch (error) {
    console.log(error);
  }
};
export const updateFoldersBulk = async (
  foldersToUpdate: WorkoutsFolderPopulated[],
) => {
  const foldersToUpdateNotPopulated = foldersToUpdate.map((folder) => {
    const { workouts, ...folderNotPopulated } = folder;
    return folderNotPopulated;
  });
  const { error } = await supabase
    .from("folders")
    .upsert(foldersToUpdateNotPopulated);

  if (error) {
    throw error;
  }
};
export const updateFolder = async (folderToUpdate: Partial<WorkoutsFolder>) => {
  try {
    const { error } = await supabase
      .from("folders")
      .update(folderToUpdate)
      .eq("id", folderToUpdate.id);

    if (error) console.error("Supabase error:", error);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};
export const deleteFolder = async (
  folderId: string,
  folders: WorkoutsFolderPopulated[],
  removeFolder: (folderId: string) => void,
) => {
  //at least one folder
  if (folders.length <= 1) return { error: "Cannot delete last folder" };

  const folder = folders.find((folder) => folder.id === folderId);
  if (!folder) return { error: "Folder not found" };

  try {
    const existingInitialFolder = folders.find(
      (folder) => folder.name === INITIAL_FOLDER_NAME,
    );
    let initialFolderId = existingInitialFolder?.id;

    if (folder.workouts.length > 0 && !initialFolderId) {
      const user = userStore.getState().user;
      if (!user?.id || !user.active_split_id) {
        return { error: "Unable to find the active user split" };
      }

      const initialFolder = await createFolder({
        name: INITIAL_FOLDER_NAME,
        split_id: user.active_split_id,
        user_id: user.id,
        order: null,
      });
      initialFolderId = initialFolder?.id;

      if (!initialFolderId) {
        return { error: "Unable to create a folder for the workouts" };
      }
    }

    if (folder.workouts.length > 0 && initialFolderId) {
      const updatedWorkouts = folder.workouts.map((workout) => ({
        ...workout,
        folder_id: initialFolderId,
      }));
      await updateWorkoutsBulk(updatedWorkouts);
    }

    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId);
    if (error) {
      throw error;
    }

    removeFolder(folderId);
  } catch (error) {
    console.error("Unable to delete folder:", error);
    return { error: "Unable to delete the folder. Please try again." };
  }
};
