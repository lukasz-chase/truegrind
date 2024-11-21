import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {
  close: () => void;
};

const CustomFooter = ({ close }: Props) => {
  return (
    <Animated.View layout={LinearTransition}>
      <Pressable style={styles.footerContainer} onPress={close}>
        <Text style={styles.footerText}>Add Exercises</Text>
      </Pressable>
      <Pressable style={styles.footerContainer} onPress={close}>
        <Text style={styles.footerText}>Cancel Workout</Text>
      </Pressable>
    </Animated.View>
  );
};

export default CustomFooter;
const styles = StyleSheet.create({
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: "#80f",
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
  },
});
