import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

const LoadingAnimation = () => {
  const rotateZ = useSharedValue(0);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  useEffect(() => {
    rotateZ.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, [rotateZ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotateZ.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <MaterialIcons name="hourglass-empty" size={50} color={theme.blue} />
      </Animated.View>
    </View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.semiTransparent,
      zIndex: 1000,
    },
  });

export default LoadingAnimation;
