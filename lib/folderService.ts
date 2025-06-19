import { WorkoutsFolder, WorkoutsFolderPopulated } from "@/types/folders";
import { supabase } from "./supabase";
import { INITIAL_FOLDER_NAME } from "@/constants/initialState";

export const fetchUserFoldersWithWorkouts = async (
  userId: string,
  splitId: string
) => {
  const { data, error } = await supabase
    .from("folders")
    .select(
      `*, workouts(*, workout_exercises(*, exercises(*), exercise_sets(*)))`
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
  try {
    const { data, error } = await supabase.from("folders").insert(folderData);
    console.log(error);
    if (data) {
      return data as WorkoutsFolder;
    }
  } catch (error) {
    console.log(error);
  }
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
  foldersToUpdate: WorkoutsFolderPopulated[]
) => {
  try {
    const foldersToUpdateNotPopulated = foldersToUpdate.map((folder) => {
      const { workouts, ...folderNotPopulated } = folder;
      return folderNotPopulated;
    });
    console.log(foldersToUpdateNotPopulated);
    const { error } = await supabase
      .from("folders")
      .upsert(foldersToUpdateNotPopulated);

    if (error) console.error("Supabase error:", error);
  } catch (error) {
    console.error("Unexpected error:", error);
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
export const deleteFolder = async (folderId: string) => {
  await supabase.from("folders").delete().eq("id", folderId);
};
