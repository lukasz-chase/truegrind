import { StyleSheet, View, Pressable, Text } from "react-native";
import Exercises from "@/components/ExercisesList/Exercises";
import { useMemo, useState } from "react";
import ExerciseFormModal from "@/components/Modals/ExerciseForm/ExerciseFormModal";
import { SafeAreaView } from "react-native-safe-area-context";
import useExerciseDetailsModal from "@/store/useExerciseDetailsModal";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

export default function ExercisesScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useExerciseDetailsModal();
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
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
          onPress={(exercise) => openModal(exercise)}
          selectedExercises={[]}
        />
      </View>
      <ExerciseFormModal
        closeModal={() => setIsVisible(false)}
        isVisible={isVisible}
        title="New Exercise"
      />
    </SafeAreaView>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.blue,
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textColor,
    },
    headerSpacer: {
      width: 40, // Same width as the "New" button to balance spacing
    },
  });
