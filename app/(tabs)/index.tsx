import WorkoutPreviewModal from "@/components/Modals/WorkoutPreviewModal";
import WorkoutCard from "@/components/WorkoutCard";
import { AppColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import useAppStore from "@/store/useAppStore";
import useActiveWorkout from "@/store/useActiveWorkout";
import useBottomSheet from "@/store/useBottomSheet";
import userStore from "@/store/userStore";
import { Workout } from "@/types/workout";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import uuid from "react-native-uuid";

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { setIsSheetVisible } = useBottomSheet();
  const { activeWorkout, setActiveWorkout, setIsNewWorkout } =
    useActiveWorkout();
  const { user } = userStore();
  const { refetchNumber } = useAppStore();
  useEffect(() => {
    fetchWorkouts();
  }, [user, refetchNumber]);

  const fetchWorkouts = async () => {
    try {
      const { data } = await supabase
        .from("workouts")
        .select(
          `id, name, notes, user_id, workout_exercises(id, timer, notes, order, exercises(id, name, image, muscle, equipment), exercise_sets(*))`
        )
        .eq("user_id", user?.id)
        .returns<Workout[]>();
      if (data) {
        setWorkouts(data);
        const activeWorkoutIndex = data.findIndex(
          (workout) => workout.id === activeWorkout?.id
        );
        if (activeWorkoutIndex !== -1) {
          setActiveWorkout(data[activeWorkoutIndex]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startWorkout = () => {
    setIsNewWorkout(false);
    setIsVisible(false);
    setIsSheetVisible(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const startAnEmptyWorkout = () => {
    setIsNewWorkout(true);
    setActiveWorkout({
      id: uuid.v4(),
      name: "Workout",
      notes: "",
      user_id: user!.id,
      workout_exercises: [],
    });
    setIsSheetVisible(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Start Workout</Text>
        <Pressable style={styles.actionButton} onPress={startAnEmptyWorkout}>
          <Text style={styles.actionButtonText}>Start an Empty Workout</Text>
        </Pressable>
        <View style={styles.templateHeader}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <Pressable style={styles.templatesButton}>
            <Text style={styles.templatesButtonText}>+ Template</Text>
          </Pressable>
        </View>
        <Text>My Templates ({workouts.length})</Text>
        <View style={styles.workouts}>
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              openModal={() => setIsVisible(true)}
            />
          ))}
        </View>
      </View>
      {activeWorkout && (
        <WorkoutPreviewModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          workout={activeWorkout}
          startWorkout={startWorkout}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: AppColors.black,
    paddingVertical: 20,
    fontWeight: "bold",
  },
  actionButton: {
    borderRadius: 10,
    backgroundColor: AppColors.blue,
    padding: 10,
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  templateHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  templatesTitle: {
    fontSize: 24,
    color: AppColors.black,
    fontWeight: "bold",
  },
  templatesButton: {
    padding: 4,
    borderRadius: 10,
    backgroundColor: AppColors.lightBlue,
  },
  templatesButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: AppColors.blue,
  },
  workouts: {
    width: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
});
