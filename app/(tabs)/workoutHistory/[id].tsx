import userStore from "@/store/userStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorkoutHistory } from "@/types/workout";
import WorkoutSummary from "@/components/WorkoutSummary";
import { fetchWorkoutHistory } from "@/lib/workoutServices";
import WorkoutHistorySkeleton from "@/components/Skeletons/WorkoutHistorySkeleton";
import useThemeStore from "@/store/useThemeStore";
import { calculatePRs } from "@/utils/prs";
import { ThemeColors } from "@/types/user";

export default function workoutHistory() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [PRs, setPRs] = useState(0);
  const { id } = useLocalSearchParams();
  const { user } = userStore();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          const data = await fetchWorkoutHistory(id as string, user.id);
          if (data) {
            setWorkoutHistory(data);
            calculateAndSetPRs(data);
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

  const calculateAndSetPRs = async (workout: WorkoutHistory) => {
    const workoutExercises = workout.workout_exercises ?? [];
    const totalPRs = await calculatePRs(workoutExercises);
    setPRs(totalPRs);
  };
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
          <AntDesign name="left" size={24} color={theme.textColor} />
        </Pressable>
        <Text style={styles.title}>{workoutHistory?.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      <WorkoutSummary workout={workoutHistory} PRs={PRs} />
    </SafeAreaView>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: theme.background,
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
      color: theme.textColor,
    },
  });
