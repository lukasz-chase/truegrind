import WorkoutPreviewModal from "@/components/Modals/WorkoutPreviewModal";
import WorkoutCard from "@/components/WorkoutCard";
import { AppColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import useAppStore from "@/store/useAppStore";
import useActiveWorkout from "@/store/useActiveWorkout";
import useBottomSheet from "@/store/useBottomSheet";
import userStore from "@/store/userStore";
import { Workout } from "@/types/workout";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import WorkoutExercisesModal from "@/components/Modals/WorkoutExercisesModal";

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { setIsSheetVisible } = useBottomSheet();
  const { activeWorkout, setActiveWorkout } = useActiveWorkout();
  const { session } = userStore();
  const { refetchNumber } = useAppStore();
  useEffect(() => {
    fetchWorkouts();
  }, [session, refetchNumber]);

  const fetchWorkouts = async () => {
    try {
      const { data } = await supabase
        .from("workouts")
        .select(
          `id, name, notes, user_id, workout_exercises(id, timer, notes, order, exercises(id, name, image, muscle, equipment), exercise_sets(*))`
        )
        .eq("user_id", session?.user?.id)
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
    setIsVisible(false);
    setIsSheetVisible(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Start Workout</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsSheetVisible(true)}
        >
          <Text style={styles.actionButtonText}>Start an Empty Workout</Text>
        </TouchableOpacity>
        <View style={styles.templateHeader}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <TouchableOpacity style={styles.templatesButton}>
            <Text style={styles.templatesButtonText}>+ Template</Text>
          </TouchableOpacity>
        </View>
        <Text>My Templates ({workouts.length})</Text>
        <ScrollView style={styles.workouts}>
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              openModal={() => setIsVisible(true)}
            />
          ))}
        </ScrollView>
      </View>
      {activeWorkout && (
        <WorkoutPreviewModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          workout={activeWorkout}
          startWorkout={startWorkout}
        />
      )}
      <WorkoutExercisesModal />
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
    display: "flex",
    marginTop: 20,
  },
});
