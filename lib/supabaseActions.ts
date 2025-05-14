import { Alert } from "react-native";
import { supabase } from "./supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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

export const uploadImageToBucket = async (
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
export const deleteImageFromBucket = async (
  filePath: string,
  bucketName: string
) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    if (error) console.log(error);
  } catch (error) {
    console.log(error);
  }
};

export const exportData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("workout_history")
      .select(
        `
      *,
      exercises_history(
        *,
        exercises(*),
        exercise_sets:sets_history(*)
      )
    `
      )
      .eq("user_id", userId);
    if (error) {
      console.log(error);
      Alert.alert(
        "Export Error",
        "There was a problem exporting your data. Please try again."
      );
      return;
    }
    if (data) {
      const jsonString = JSON.stringify(data, null, 2);

      const fileName = `workout_history_${userId}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Workout History",
          UTI: "public.json", // for iOS
        });
      } else {
        Alert.alert("Sharing not available", `Saved file to ${fileUri}`);
      }
    }
  } catch (error) {
    console.error("Export failed", error);
    Alert.alert(
      "Export Error",
      "There was a problem exporting your data. Please try again."
    );
  }
};
