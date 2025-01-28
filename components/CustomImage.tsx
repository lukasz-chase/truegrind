import { Image } from "expo-image";
import React from "react";

type Props = {
  imageUrl: string;
  height: number;
  width: number;
  customStyle?: any;
};
const CustomImage = ({ height, imageUrl, width, customStyle }: Props) => {
  return <Image source={imageUrl} style={{ height, width, ...customStyle }} />;
};

export default CustomImage;
