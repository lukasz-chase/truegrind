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
import { fetchUserSplitWithWorkouts } from "@/lib/splitsServices";
import { SplitPopulated } from "@/types/split";
import { Link, useRouter } from "expo-router";

export default function WorkoutScreen() {
  const [split, setSplit] = useState<SplitPopulated | null>(null);
  const [loading, setLoading] = useState(false);

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

  const router = useRouter();

  useEffect(() => {
    getWorkouts();
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

  const getWorkouts = async () => {
    setLoading(true);
    try {
      const data = await fetchUserSplitWithWorkouts(
        user!.id,
        user!.active_split_id
      );
      if (data) {
        setSplit(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Title Placeholder */}
          <View style={styles.skeletonTitle} />
          {/* Buttons */}
          <View style={styles.skeletonButton} />
          <View style={styles.skeletonButton} />

          {/* Template Header Placeholder */}
          <View style={styles.templateHeader}>
            <View style={styles.skeletonSubtitle} />
            <View style={styles.skeletonTemplateBtn} />
          </View>
          {/* Skeleton cards for workouts */}
          <View style={styles.workouts}>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {split ? (
        <>
          <View style={styles.container}>
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
            <Pressable
              style={styles.actionButton}
              onPress={startAnEmptyWorkout}
            >
              <Text style={styles.actionButtonText}>
                Start an Empty Workout
              </Text>
            </Pressable>
            <View style={styles.templateHeader}>
              <Text style={styles.templatesTitle}>Templates</Text>
              <Pressable style={styles.templatesButton}>
                <Text style={styles.templatesButtonText}>+ Template</Text>
              </Pressable>
            </View>
            <Text>My Templates ({split.workouts.length})</Text>
          </View>

          <ScrollView contentContainerStyle={styles.workouts}>
            {split.workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </ScrollView>
        </>
      ) : (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
                Create a Split
              </Text>
            </View>
          </Pressable>
        </View>
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
  splitButton: {
    borderRadius: 10,
    backgroundColor: "white",
    padding: 10,
    borderWidth: 1,
    borderColor: AppColors.blue,
    marginVertical: 10,
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
    alignItems: "center",
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

  // Skeleton styles
  skeletonTitle: {
    height: 30,
    width: "50%",
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginVertical: 10,
  },
  skeletonButton: {
    height: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginVertical: 10,
  },
  skeletonSubtitle: {
    width: "30%",
    height: 24,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  skeletonTemplateBtn: {
    width: 100,
    height: 30,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  skeletonCard: {
    width: "47%",
    height: 100,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 10,
  },
});
