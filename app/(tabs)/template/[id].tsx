import userStore from "@/store/userStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, StyleSheet, View, Pressable, Platform } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchWorkout, updateWorkout } from "@/lib/workoutServices";
import { AppColors } from "@/constants/colors";
import WorkoutExerciseWrapper from "@/components/BottomSheet/WorkoutExerciseWrapper";
import WorkoutExercise from "@/components/BottomSheet/WorkoutExercise";
import { ScrollView } from "react-native-gesture-handler";
import WorkoutDetails from "@/components/BottomSheet/WorkoutDetails";
import DraggableList from "@/components/BottomSheet/DraggableExercisesList.tsx/DraggableList";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import Animated, {
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import useWorkoutExercisesModal from "@/store/useWorkoutExercisesModal";
import { Exercise } from "@/types/exercises";
import useWorkoutTemplate from "@/store/useWorkoutTemplate";
import { WorkoutExercise as WorkoutExerciseType } from "@/types/workoutExercise";
import CustomKeyboard from "@/components/Keyboard/CustomKeyboard";
import { updateWorkoutExercises } from "@/lib/workoutExerciseServices";
import { updateExerciseSets } from "@/lib/exerciseSetsService";
import useAppStore from "@/store/useAppStore";
import * as Haptics from "expo-haptics";
import useSplitsStore from "@/store/useSplitsStore";
import { initialWorkoutState } from "@/constants/initialState";

export default function WorkoutTemplate() {
  const [loading, setLoading] = useState(false);
  const [dragItemId, setDragItemId] = useState<string | null>(null);

  const { id } = useLocalSearchParams();
  const { user } = userStore();

  const router = useRouter();

  const animateIndex = useSharedValue(1);

  const {
    setWorkout,
    setIsNewWorkout,
    workout,
    isNewWorkout,
    updateWorkoutField,
    reorderWorkoutExercises,
    addNewWorkoutExercise,
    updateWorkoutExerciseField,
    addNewSet,
    updateExerciseSet,
    deleteExerciseSet,
    resetWorkout,
    initialWorkout,
  } = useWorkoutTemplate();
  const { isVisible: IsKeyboardVisible, closeKeyboard } = useCustomKeyboard();
  const { openModal, closeModal } = useWorkoutExercisesModal();
  const { refetchData } = useAppStore();
  const { activeSplit } = useSplitsStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          const data = await fetchWorkout(id as string, user.id);
          if (data) {
            setWorkout(data);
          } else {
            setIsNewWorkout(true);
            setWorkout({
              ...initialWorkoutState.activeWorkout,
              user_id: user.id,
              split_id: activeSplit!.id,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching measurements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, id]);

  const goBackHandler = () => {
    closeKeyboard();
    resetWorkout();
    router.push("/(tabs)");
  };
  const handleReorder = (newOrder: string[]) => {
    reorderWorkoutExercises(newOrder);
    setDragItemId(null);
  };
  const addExercises = async (
    exercises: Exercise[],
    newExerciseProperties?: Partial<WorkoutExerciseType>
  ) => {
    exercises.map(
      async (exercise) =>
        await addNewWorkoutExercise(exercise, newExerciseProperties)
    );
    closeModal();
  };

  const saveTemplate = async () => {
    try {
      await updateWorkout(workout, initialWorkout, isNewWorkout, true);

      await updateWorkoutExercises(workout, initialWorkout, true);
      await updateExerciseSets(workout, initialWorkout, true);

      refetchData();
      goBackHandler();
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error finishing workout:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.skeleton, { width: 50 }]} />
          <View style={[styles.skeleton, { width: 150 }]} />
          <View style={[styles.skeleton, { width: 50 }]} />
        </View>
        <View style={{ flexDirection: "column", gap: 10, padding: 10 }}>
          <View style={[styles.skeleton, { width: 150 }]} />
          <View style={[styles.skeleton, { width: 50 }]} />
          <View style={[styles.skeleton, { width: 200 }]} />
          <View style={[styles.skeleton, { width: "100%" }]} />
          <View style={[styles.skeleton, { width: "100%" }]} />
          <View style={[styles.skeleton, { width: "100%" }]} />
          <View style={[styles.skeleton, { width: "100%" }]} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.goBackButton} onPress={goBackHandler}>
          <AntDesign name="left" size={24} color={AppColors.black} />
        </Pressable>
        <Text style={styles.title}>
          {isNewWorkout ? "New Template" : "Edit Template"}
        </Text>
        <Pressable style={styles.saveButton} onPress={saveTemplate}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
      <Pressable style={styles.container} onPress={closeKeyboard}>
        <ScrollView>
          <WorkoutDetails
            updateWorkoutField={updateWorkoutField}
            workout={workout}
            isEditTemplate={true}
          />
          {dragItemId && (
            <DraggableList
              data={
                workout?.workout_exercises?.sort((a, b) => a.order - b.order) ??
                []
              }
              onReorder={handleReorder}
              dragItemId={dragItemId}
            />
          )}

          {workout?.workout_exercises
            ?.sort((a, b) => a.order - b.order)
            .map((workoutExercise) => (
              <WorkoutExerciseWrapper
                dragItemId={dragItemId}
                key={workoutExercise.id}
              >
                {workoutExercise.superset && (
                  <View
                    style={[
                      styles.supersetIndicator,
                      { backgroundColor: workoutExercise.superset },
                    ]}
                  />
                )}
                <WorkoutExercise
                  workoutExercise={workoutExercise}
                  setDragItemId={setDragItemId}
                  addNewSet={addNewSet}
                  updateWorkoutExerciseField={updateWorkoutExerciseField}
                  deleteExerciseSet={deleteExerciseSet}
                  updateExerciseSet={updateExerciseSet}
                  isEditTemplate={true}
                />
              </WorkoutExerciseWrapper>
            ))}
          <Animated.View layout={LinearTransition}>
            <Pressable
              style={[styles.footerButton, styles.addExerciseButton]}
              onPress={() => {
                openModal(addExercises, true, "Add");
              }}
            >
              <Text style={[styles.footerText, styles.addExerciseButtonText]}>
                Add Exercises
              </Text>
            </Pressable>
            <View style={{ height: IsKeyboardVisible ? 100 : 50 }} />
          </Animated.View>
        </ScrollView>
      </Pressable>
      <CustomKeyboard animatedIndex={animateIndex} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goBackButton: {
    backgroundColor: AppColors.gray,
    padding: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: AppColors.blue,
    padding: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 18,
    color: "white",
  },
  supersetIndicator: {
    width: 2,
    height: "100%",
  },
  footerButton: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
  },
  addExerciseButton: {
    backgroundColor: AppColors.lightBlue,
  },
  addExerciseButtonText: {
    color: AppColors.blue,
  },
  footerText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  skeleton: {
    height: 40,
    backgroundColor: AppColors.gray,
  },
});
