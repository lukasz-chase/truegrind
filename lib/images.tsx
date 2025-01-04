import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const pickAndCompressImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
  });
  if (!result.canceled) {
    const compress = await manipulateAsync(
      result.assets[0].uri,
      [{ resize: { height: 400, width: 400 } }],
      {
        base64: true,
        compress: 0.2,
        format: SaveFormat.JPEG,
      }
    );
    const extension = result.assets[0].mimeType!.split("/")[1];
    return { url: compress.base64!, extension };
  } else {
    alert("You did not select any image.");
  }
};
