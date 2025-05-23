import { UserProfile } from "@/types/user";
import { supabase } from "./supabase";
import userStore from "@/store/userStore";
import { deleteImageFromBucket, uploadImageToBucket } from "./supabaseActions";

export const setProfileInUserStore = async (userId: string) => {
  try {
    const { data, error, status } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error && status !== 406) {
      throw error;
    }
    if (data) {
      userStore.setState({ user: data });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const updateUserProfile = async (
  userId: string,
  propertiesToUpdate: Partial<UserProfile>,
  profilePicture?: {
    url: string | null;
    extension: string;
    imageWasChanged: boolean;
  }
) => {
  if (profilePicture?.imageWasChanged && profilePicture.url) {
    const imagePath = `${userId}/profilePicture.${profilePicture.extension}`;
    await deleteImageFromBucket(imagePath, "users");
    const imageUrl = await uploadImageToBucket(
      profilePicture.url,
      imagePath,
      "users"
    );
    if (imageUrl) {
      propertiesToUpdate = { ...propertiesToUpdate, profile_picture: imageUrl };
    }
  }
  const { data, error } = await supabase
    .from("profiles")
    .update(propertiesToUpdate)
    .eq("id", userId)
    .select("*")
    .returns<UserProfile[]>();
  if (data) {
    userStore.setState({ user: data[0] });
  }
  if (error) {
    console.log("error", error);
  }
};
export const deleteAuthUser = async (userId: string) => {
  try {
    await supabase.auth.admin.deleteUser(userId);
    userStore.setState({ session: null, user: null });
    await supabase.auth.signOut();
  } catch (err) {
    console.log(err);
  }
};
