import React, { useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import useThemeStore from "@/store/useThemeStore";

const CustomBackdrop = ({
  animatedIndex,
  style,
  animatedPosition,
}: BottomSheetBackdropProps) => {
  const { theme } = useThemeStore((state) => state);

  // BottomSheetBackdrop animates opacity and manages touchability itself.
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: theme.semiTransparent,
      },
    ],
    [style, theme.semiTransparent]
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
