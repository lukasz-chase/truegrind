import { BottomTabBar } from "@react-navigation/bottom-tabs"; // Import the BottomTabBar
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import SafeArea
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useMemo } from "react";

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  animatedIndex,
}: any) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedY = interpolate(animatedIndex.value, [0, 1], [0, 90]);

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
    [animatedStyle]
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
