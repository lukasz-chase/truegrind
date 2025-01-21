import WorkoutCard from "@/components/WorkoutCard";
import { AppColors } from "@/constants/colors";
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
import { ScrollView } from "react-native-gesture-handler";
import { fetchWorkouts } from "@/lib/workoutServices";

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const { setIsSheetVisible } = useBottomSheet();
  const {
    activeWorkout,
    setActiveWorkout,
    setIsNewWorkout,
    persistedStorage,
    setPersistedStorage,
  } = useActiveWorkout();
  const { user } = userStore();
  const { refetchNumber } = useAppStore();
  useEffect(() => {
    getWorkouts();
  }, [user, refetchNumber]);
  useEffect(() => {
    //this means that the active workout wasnt persisted so clear the flag, otherwise it will open on workout click
    if (!activeWorkout.user_id) {
      setPersistedStorage(false);
    }
    //if there is an user id that means there is a valid activeWorkout
    //we need to wait for user to load so the user.id check
    //we check if the workout was saved by persisting so when user clicks on one of the workouts it doesnt automaticaly open the sheet
    if (activeWorkout.user_id && user?.id && persistedStorage) {
      setIsSheetVisible(true);
    }
  }, [activeWorkout, user]);
  const getWorkouts = async () => {
    try {
      const data = await fetchWorkouts(user!.id);
      if (data) {
        setWorkouts(data);
      }
    } catch (error) {
      console.log(error);
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
      </View>

      <ScrollView contentContainerStyle={styles.workouts}>
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </ScrollView>
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
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 20,
  },
  workoutsWrapper: {},
});
