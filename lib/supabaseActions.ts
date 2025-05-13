import { supabase } from "./supabase";
import { decode } from "base64-arraybuffer";

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
