import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
} from "react-native";
import ExerciseRow from "../ExerciseRow";
import CloseButton from "../CloseButton";
import userStore from "@/store/userStore";
import { copyWorkout } from "@/lib/workoutServices";
import useAppStore from "@/store/useAppStore";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";
import useWorkoutPreviewModal from "@/store/useWorkoutPreviewModal";
import { useShallow } from "zustand/shallow";

export default function WorkoutPreviewModal() {
  const { closeModal, isVisible, startWorkout, workout } =
    useWorkoutPreviewModal(
      useShallow((state) => ({
        closeModal: state.closeModal,
        isVisible: state.isVisible,
        startWorkout: state.startWorkout,
        workout: state.workout,
      }))
    );
  const user = userStore((state) => state.user);
  const setRefetchWorkouts = useAppStore((state) => state.setRefetchWorkouts);
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  if (!workout) return null;
  const copyWorkoutHandler = async () => {
    await copyWorkout(workout, user!.id);
    setRefetchWorkouts();
  };
  const editWorkoutTemplate = () => {
    router.push({
      pathname: "/template/[folderId]/[id]",
      params: { folderId: workout.folder_id!, id: workout.id },
    });
    closeModal();
  };
  const exercises = workout.workout_exercises
    ? [...workout.workout_exercises].sort((a, b) => a.order - b.order)
    : [];
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <CloseButton onPress={closeModal} />
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  {workout.name}
                </Text>
                {workout.user_id === user?.id ? (
                  <Pressable onPress={editWorkoutTemplate}>
                    <Text style={styles.modalEditButton}>Edit</Text>
                  </Pressable>
                ) : (
                  <View style={{ width: 24 }} />
                )}
              </View>
              <FlatList
                style={styles.exercisesList}
                data={exercises}
                renderItem={({ item }) => (
                  <View style={styles.workoutWrapper}>
                    {item.superset && (
                      <View
                        style={[
                          styles.supersetIndicator,
                          { backgroundColor: item.superset },
                        ]}
                      />
                    )}
                    <ExerciseRow
                      exercise={item.exercises}
                      numberOfSets={item.exercise_sets.length}
                      onPress={() => {}}
                      isSelected={false}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
              {workout.user_id === user?.id ? (
                <Pressable onPress={startWorkout} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Start Workout</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={copyWorkoutHandler}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>Copy Workout</Text>
                </Pressable>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.semiTransparent, // semi-transparent background
      justifyContent: "center",
      alignItems: "center",
      padding: 20, // padding outside the modal
    },
    modalContent: {
      width: "100%", // Adjust width as needed
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: theme.background,
      minHeight: 150,
      maxHeight: 500,
    },
    modalHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
      marginBottom: 10,
    },
    exercisesList: {
      width: "100%",
    },
    modalHeaderTitle: {
      color: theme.textColor,
      fontWeight: "bold",
      fontSize: 18,
      width: 180,
      textAlign: "center",
    },
    modalEditButton: {
      color: theme.blue,
      fontSize: 20,
    },
    actionButton: {
      width: "100%",
      backgroundColor: theme.blue,
      padding: 10,
      borderRadius: 8,
    },
    actionButtonText: {
      textAlign: "center",
      color: theme.white,
      fontSize: 18,
      fontWeight: "bold",
    },
    workoutWrapper: {
      flexDirection: "row",
      gap: 6,
      paddingLeft: 6,
      paddingBottom: 6,
    },
    supersetIndicator: {
      width: 2,
      height: "100%",
    },
  });
