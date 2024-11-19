import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  close: () => void;
};

const CustomFooter = ({ close }: Props) => {
  return (
    <View>
      <Pressable style={styles.footerContainer} onPress={close}>
        <Text style={styles.footerText}>Close</Text>
      </Pressable>
    </View>
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
