import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";

const LoadingAnimation = () => {
  const rotateZ = useSharedValue(0);

  useEffect(() => {
    rotateZ.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, [rotateZ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotateZ.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <MaterialIcons
          name="hourglass-empty"
          size={50}
          color={AppColors.blue}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 1000, // Ensure it's on top of other content
  },
});

export default LoadingAnimation;
