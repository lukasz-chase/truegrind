import { StyleSheet, SafeAreaView } from "react-native";
import Exercises from "@/components/Exercises";

export default function ExercisesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Exercises onPress={() => console.log("pressed")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
