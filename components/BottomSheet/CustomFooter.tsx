import { AppColors } from "@/constants/colors";
import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {
  close: () => void;
};

const CustomFooter = ({ close }: Props) => {
  return (
    <Animated.View layout={LinearTransition}>
      <Pressable
        style={[styles.footerButton, styles.addExerciseButton]}
        onPress={close}
      >
        <Text style={[styles.footerText, styles.addExerciseButtonText]}>
          Add Exercises
        </Text>
      </Pressable>
      <Pressable
        style={[styles.footerButton, styles.cancelWorkoutButton]}
        onPress={close}
      >
        <Text style={[styles.footerText, styles.cancelWorkoutButtonText]}>
          Cancel Workout
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default CustomFooter;
const styles = StyleSheet.create({
  footerButton: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
  },
  addExerciseButton: {
    backgroundColor: AppColors.lightBlue,
  },
  cancelWorkoutButton: {
    backgroundColor: AppColors.lightRed,
  },
  addExerciseButtonText: {
    color: AppColors.blue,
  },
  cancelWorkoutButtonText: {
    color: AppColors.red,
  },
  footerText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
