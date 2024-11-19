import { BottomTabBar } from "@react-navigation/bottom-tabs"; // Import the BottomTabBar
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import SafeArea
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useBottomSheet from "@/store/useBottomSheet";
import { useEffect } from "react";

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets(); // Get the safe area insets
  const { sheetIndex } = useBottomSheet();
  const translateY = useSharedValue(0);

  // Update the shared value when the sheet index changes
  useEffect(() => {
    translateY.value = withTiming(sheetIndex === 0 ? 0 : 90, { duration: 300 });
  }, [sheetIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedY = interpolate(
      translateY.value,
      [0, 90], // Input range
      [0, 90] // Output range (can adjust for fine-tuning)
    );

    return {
      transform: [
        {
          translateY: interpolatedY,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          zIndex: 2,
        },
        animatedStyle,
      ]}
    >
      <BottomTabBar
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        insets={insets} // Pass the insets
        style={{
          backgroundColor: "#25292e",
        }}
      />
    </Animated.View>
  );
};

export default CustomTabBar;
