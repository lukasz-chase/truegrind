import { StyleSheet, SafeAreaView, View, Pressable, Text } from "react-native";
import Exercises from "@/components/Exercises";
import { AppColors } from "@/constants/colors";
import { useState } from "react";
import NewExerciseModal from "@/components/Modals/NewExerciseModal";

export default function ExercisesScreen() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Pressable onPress={() => setIsVisible(true)}>
              <Text style={styles.headerButton}>New</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Exercises</Text>
            <View style={styles.headerSpacer} />
          </View>
          <Exercises
            onPress={() => console.log("pressed")}
            selectedExercises={[]}
          />
        </View>
      </SafeAreaView>
      <NewExerciseModal
        closeModal={() => setIsVisible(false)}
        isVisible={isVisible}
        onDismiss={() => {}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerButton: {
    fontSize: 18,
    color: AppColors.blue,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40, // Same width as the "New" button to balance spacing
  },
});
