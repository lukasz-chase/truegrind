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
    return compress.base64!;
  } else {
    alert("You did not select any image.");
  }
};
