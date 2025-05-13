import userStore from "@/store/userStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorkoutHistory } from "@/types/workout";
import WorkoutSummary from "@/components/WorkoutSummary";
import { fetchWorkoutHistory } from "@/lib/workoutServices";
import { AppColors } from "@/constants/colors";
import WorkoutHistorySkeleton from "@/components/Skeletons/WorkoutHistorySkeleton";

export default function workoutHistory() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams();
  const { user } = userStore();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          const data = await fetchWorkoutHistory(id as string, user.id);
          if (data) {
            setWorkoutHistory(data);
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
    router.push("/(tabs)/calendar");
  };

  if (loading) return <WorkoutHistorySkeleton parentStyles={styles} />;
  if (!workoutHistory)
    return (
      <View>
        <Text>Workout not found</Text>
        <Pressable onPress={goBackHandler}>
          <Text>Go Back</Text>
        </Pressable>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBackHandler}>
          <AntDesign name="left" size={24} color={AppColors.black} />
        </Pressable>
        <Text style={styles.title}>{workoutHistory?.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      <WorkoutSummary workout={workoutHistory} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: AppColors.white,
    height: "100%",
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
