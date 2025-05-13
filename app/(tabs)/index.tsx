import WorkoutCard from "@/components/WorkoutCard";
import { AppColors } from "@/constants/colors";
import useAppStore from "@/store/useAppStore";
import useActiveWorkout from "@/store/useActiveWorkout";
import useBottomSheet from "@/store/useBottomSheet";
import userStore from "@/store/userStore";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import uuid from "react-native-uuid";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Workout } from "@/types/workout";
import { fetchExampleWorkouts } from "@/lib/workoutServices";
import useSplitsStore from "@/store/useSplitsStore";
import MainScreenSkeleton from "@/components/Skeletons/MainScreenSkeleton";

export default function WorkoutScreen() {
  const [exampleWorkouts, setExampleWorkouts] = useState<Workout[] | null>(
    null
  );
  const [dataLoading, setDataLoading] = useState(false);

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
  const { activeSplit: split, loading } = useSplitsStore();

  const router = useRouter();

  useEffect(() => {
    getExampleWorkouts();
  }, [user, refetchNumber]);

  useEffect(() => {
    // this means that the active workout wasnt persisted so clear the flag,
    // otherwise it will open on workout click
    if (!activeWorkout.user_id) {
      setPersistedStorage(false);
    }
    // if there is a user id, that means there is a valid activeWorkout
    // we need to wait for user to load so the user.id check
    // if the workout was saved by persisting, open the sheet automatically
    if (activeWorkout.user_id && user?.id && persistedStorage) {
      setIsSheetVisible(true);
    }
  }, [activeWorkout, user]);
  const getExampleWorkouts = async () => {
    setDataLoading(true);
    try {
      const data = await fetchExampleWorkouts(user!.active_split_id!);
      if (data) {
        setExampleWorkouts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false);
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
      split_id: split!.id,
    });
    setIsSheetVisible(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const newTemplateHandler = () => {
    const templateId = uuid.v4();
    router.push(`/template/${templateId}`);
  };
  if (loading || dataLoading || !split) {
    return <MainScreenSkeleton parentStyles={styles} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Start Workout</Text>
        <Pressable onPress={() => router.push("/splits")}>
          <View style={styles.splitButton}>
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: AppColors.blue,
                },
              ]}
            >
              {split.name}
            </Text>
          </View>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={startAnEmptyWorkout}>
          <Text style={styles.actionButtonText}>Start an Empty Workout</Text>
        </Pressable>
        <View style={styles.templateHeader}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <Pressable
            style={styles.templatesButton}
            onPress={newTemplateHandler}
          >
            <Text style={styles.templatesButtonText}>+ Template</Text>
          </Pressable>
        </View>
        <Text style={styles.templatesText}>
          My Templates ({split.workouts.length})
        </Text>
        <View style={styles.workouts}>
          {split.workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View>
        {exampleWorkouts && (
          <>
            <Text style={[styles.templatesText, { marginTop: 20 }]}>
              Example Templates ({exampleWorkouts.length})
            </Text>
            <View style={styles.workouts}>
              {exampleWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </View>
          </>
        )}
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
  splitButton: {
    borderRadius: 10,
    backgroundColor: AppColors.white,
    padding: 10,
    borderWidth: 1,
    borderColor: AppColors.blue,
    marginVertical: 10,
  },
  actionButtonText: {
    color: AppColors.white,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  templateHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    alignItems: "center",
  },
  templatesText: {
    fontSize: 16,
    fontWeight: "bold",
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
  },
});
