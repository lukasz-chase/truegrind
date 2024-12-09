import DraggableList from "@/components/DraggableList";
import { AppColors } from "@/constants/colors";
import { Text, View, StyleSheet, Pressable, SafeAreaView } from "react-native";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Calendar screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.black,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  text: {
    color: "#fff",
  },
});
