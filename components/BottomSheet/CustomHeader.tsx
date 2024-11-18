import React, { useMemo } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomSheet } from "@gorhom/bottom-sheet";

const CustomHeader = () => {
  const { animatedIndex } = useBottomSheet();
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      styles.timerButtonContainer,
      {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      containerAnimatedStyle,
    ],
    [styles.timerButtonContainer, containerAnimatedStyle]
  );

  return (
    <View style={styles.headerContainer}>
      <Animated.View style={containerStyle}>
        <Pressable style={styles.timerButton}>
          <Ionicons name="timer-outline" size={24} color="black" />
        </Pressable>
      </Animated.View>

      <Animated.Text style={styles.headerTitle}>6:30</Animated.Text>
      <Animated.View>
        <Pressable style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Finish</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timerButtonContainer: {
    width: 80,
  },
  timerButton: {
    backgroundColor: "#c1c1c1",
    padding: 10,
    width: 52,
    borderRadius: 10,
    alignItems: "center",
  },
  headerButton: {
    backgroundColor: "#26c233",
    padding: 10,
    borderRadius: 10,
    width: 80,
  },
  headerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  contentContainer: {
    backgroundColor: "white",
  },
  handle: {
    paddingTop: 10,
    paddingBottom: 0,
  },
});
export default CustomHeader;
