import { AppColors } from "@/constants/colors";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calendar screen</Text>
      <Pressable onPress={() => console.log("pressed")}>
        <Text style={styles.text}>press</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
