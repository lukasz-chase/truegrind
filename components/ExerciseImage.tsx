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
      source={{
        uri:
          imageUrl.includes("png") || imageUrl.includes("jpg")
            ? imageUrl
            : "data:image/jpeg;base64," + imageUrl,
      }}
      style={{ height, width }}
    />
  );
};

export default ExerciseImage;
