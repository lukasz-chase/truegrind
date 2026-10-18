import { BottomTabBar, BottomTabBarProps } from "expo-router/js-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useMemo } from "react";

type Props = BottomTabBarProps & {
  animatedIndex: SharedValue<number>;
  isSheetVisible: boolean;
};

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  animatedIndex,
  isSheetVisible,
}: Props) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    // The sheet uses -1 while mounting/closing and can leave its last index
    // behind after unmount. Only an open sheet should move the tab bar.
    const interpolatedY = isSheetVisible
      ? interpolate(animatedIndex.value, [0, 1], [0, 90], Extrapolation.CLAMP)
      : 0;

    return {
      transform: [
        {
          translateY: interpolatedY,
        },
      ],
    };
  });

  // styles
  const containerStyle = useMemo(
    () => [
      {
        zIndex: 2,
      },
      animatedStyle,
    ],
    [animatedStyle],
  );
  return (
    <Animated.View style={containerStyle}>
      <BottomTabBar
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        insets={insets} // Pass the insets
      />
    </Animated.View>
  );
};

export default CustomTabBar;
