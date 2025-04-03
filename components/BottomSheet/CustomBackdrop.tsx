import React, { useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";

const CustomBackdrop = ({
  animatedIndex,
  style,
  animatedPosition,
}: BottomSheetBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: AppColors.semiTransparent,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <BottomSheetBackdrop
      animatedPosition={animatedPosition}
      animatedIndex={animatedIndex}
      style={containerStyle}
    />
  );
};

export default CustomBackdrop;
