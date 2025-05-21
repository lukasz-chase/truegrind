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
import { Workout } from "@/types/workout";
import CloseButton from "../CloseButton";
import userStore from "@/store/userStore";
import { copyWorkout } from "@/lib/workoutServices";
import useAppStore from "@/store/useAppStore";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  visible: boolean;
  onClose: () => void;
  startWorkout: () => void;
  workout: Workout;
};

export default function WorkoutPreviewModal({
  visible,
  onClose,
  startWorkout,
  workout,
}: Props) {
  const { user } = userStore();
  const { setRefetchWorkouts } = useAppStore();
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const copyWorkoutHandler = async () => {
    await copyWorkout(workout, user!.id);
    setRefetchWorkouts();
  };
  const editWorkoutTemplate = () => {
    router.push(`/template/${workout?.id}`);
    onClose();
  };
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <CloseButton onPress={onClose} />
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  {workout.name}
                </Text>
                <Pressable onPress={editWorkoutTemplate}>
                  <Text style={styles.modalEditButton}>Edit</Text>
                </Pressable>
              </View>
              <FlatList
                style={styles.exercisesList}
                data={workout.workout_exercises?.sort(
                  (a, b) => a.order - b.order
                )}
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
