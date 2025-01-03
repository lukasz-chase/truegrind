import { Image } from "expo-image";
import React from "react";

type Props = {
  imageUrl: string;
  height: number;
  width: number;
};
const ExerciseImage = ({ height, imageUrl, width }: Props) => {
  return (
    <Image
      source={
        typeof imageUrl !== "string"
          ? imageUrl
          : {
              uri: imageUrl.includes("gif")
                ? "data:image/jpeg;base64," + imageUrl
                : imageUrl,
            }
      }
      style={{ height, width }}
    />
  );
};

export default ExerciseImage;
