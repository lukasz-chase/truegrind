import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import userStore from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Progress from "react-native-progress";
import { profileLinks } from "@/constants/profile";
import { fetchUserMeasurementsSingle } from "@/lib/measurementsService";
import { Measurement } from "@/types/measurements";
import { fetchWeeklyWorkoutCount } from "@/lib/workoutServices";
import { fetchUserUpcomingWorkout } from "@/lib/workoutCalendarService";
import { WorkoutCalendarPopulated } from "@/types/workoutCalendar";
import { showHoursFromDate } from "@/utils/calendar";
import CustomImage from "@/components/CustomImage";
import ProfileSkeleton from "@/components/Skeletons/ProfileSkeleton";
import { exportData } from "@/lib/supabaseActions";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import useAppStore from "@/store/useAppStore";

export default function Profile() {
  const { user } = userStore();
  const [goalMeasurement, setGoalMeasurement] = useState<Measurement | null>(
    null
  );
  const [weight, setWeight] = useState<Measurement | null>(null);
  const [upcomingWorkout, setUpcomingWorkout] =
    useState<WorkoutCalendarPopulated | null>(null);
  const [workoutFrequency, setWorkoutFrequency] = useState<number | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const { theme } = useThemeStore((state) => state);
  const { refetchProfileData } = useAppStore();

  const styles = useMemo(() => makeStyles(theme), [theme]);

  const signOut = async () => {
    try {
      userStore.setState({ session: null, user: null });
      await supabase.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      if (!user?.id) return;

      const [
        goalDataPromise,
        weightDataPromise,
        upcomingWorkoutDataPromise,
        workoutFrequencyDataPromise,
      ] = [
        user.current_goal?.name
          ? fetchUserMeasurementsSingle(user.id, user.current_goal.name)
          : Promise.resolve(null),
        fetchUserMeasurementsSingle(user.id, "weight"),
        fetchUserUpcomingWorkout(user.id),
        fetchWeeklyWorkoutCount(user.id),
      ];

      const [goalData, weightData, upcomingWorkoutData, workoutFrequencyData] =
        await Promise.all([
          goalDataPromise,
          weightDataPromise,
          upcomingWorkoutDataPromise,
          workoutFrequencyDataPromise,
        ]);
      if (goalData) setGoalMeasurement(goalData);
      if (weightData) setWeight(weightData);
      if (upcomingWorkoutData) setUpcomingWorkout(upcomingWorkoutData);
      else setUpcomingWorkout(null);
      if (typeof workoutFrequencyData === "number") {
        setWorkoutFrequency(workoutFrequencyData);
      }
    } catch (error) {
      console.error("Error fetching measurements", error);
    } finally {
      setFetchLoading(false);
    }
  };
  const exportDataHandler = async () => {
    setExportLoading(true);
    if (user) {
      await exportData(user.id);
    }
    setExportLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user, refetchProfileData]);

  if (fetchLoading) {
    return <ProfileSkeleton parentStyles={styles} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>TRUE GRIND</Text>
      {user?.profile_picture ? (
        <View style={styles.imageCircle}>
          <CustomImage
            imageUrl={user.profile_picture}
            height={100}
            width={100}
          />
        </View>
      ) : (
        <FontAwesome name="user-circle" size={100} color={theme.textColor} />
      )}
      <Text style={[styles.title, styles.name]}>{user?.username}</Text>
      <View style={styles.infoContainer}>
        {user?.age ? (
          <Text style={styles.userInfo}>{user?.age} years</Text>
        ) : (
          <Text style={styles.userInfo}>Age</Text>
        )}
        <Text style={styles.userInfo}>-</Text>
        {user?.height ? (
          <Text style={styles.userInfo}>{user?.height} cm</Text>
        ) : (
          <Text style={styles.userInfo}>Height</Text>
        )}
        <Text style={styles.userInfo}>-</Text>
        {weight ? (
          <Text style={styles.userInfo}>
            {weight.value} {weight.unit}
          </Text>
        ) : (
          <Text style={styles.userInfo}>Weight</Text>
        )}
      </View>
      <View style={styles.boxesContainer}>
        <View style={styles.infoBox}>
          {user?.current_goal ? (
            <>
              <Text style={styles.infoBoxTitle}>Current Goal</Text>
              <Text style={styles.infoBoxTitle}>
                {user?.current_goal?.name}
              </Text>
              <Text style={styles.infoBoxValue}>
                {user?.current_goal?.value}
                {user?.current_goal?.unit}
              </Text>
            </>
          ) : (
            <Text style={styles.infoBoxTitle}>No goal set</Text>
          )}
        </View>
        <View style={styles.infoBox}>
          {workoutFrequency ? (
            <>
              <Text style={styles.infoBoxTitle}>Workout Frequency</Text>
              <Text style={styles.infoBoxValue}>
                {workoutFrequency} per week
              </Text>
            </>
          ) : (
            <Text style={styles.infoBoxTitle}>No workouts this week</Text>
          )}
        </View>
        <View style={styles.infoBox}>
          {upcomingWorkout ? (
            <>
              <Text
                numberOfLines={2}
                style={[styles.infoBoxTitle, { textOverflow: "ellipsis" }]}
              >
                {upcomingWorkout.workouts.name}
              </Text>
              <Text style={styles.infoBoxValue}>
                {upcomingWorkout.scheduled_date}
              </Text>
              <Text style={styles.infoBoxValue}>
                {showHoursFromDate(upcomingWorkout.start_time)} -{" "}
                {showHoursFromDate(upcomingWorkout.end_time)}
              </Text>
            </>
          ) : (
            <Text style={styles.infoBoxTitle}>No upcoming workout</Text>
          )}
        </View>
      </View>
      <View style={styles.progressWrapper}>
        {goalMeasurement && user?.current_goal?.value ? (
          <>
            <Text style={styles.infoBoxValue}>
              {user?.current_goal.value < goalMeasurement.value
                ? "Goal reached!"
                : "Goal progress"}
            </Text>
            <View style={styles.progressInfo}>
              <Text style={styles.userInfo}>{goalMeasurement?.value}</Text>
              <Text style={styles.userInfo}>{user?.current_goal?.value}</Text>
            </View>
            <Progress.Bar
              progress={Math.min(
                goalMeasurement?.value / user?.current_goal?.value,
                1
              )}
              width={350}
              color={
                user?.current_goal.value < goalMeasurement.value
                  ? theme.green
                  : theme.blue
              }
              style={styles.progress}
            />
          </>
        ) : (
          <Text style={styles.userInfo}>
            {user?.current_goal?.value && !goalMeasurement
              ? "Goal set, no measurements"
              : "No goal set"}
          </Text>
        )}
      </View>
      <View style={styles.buttonsWrapper}>
        {profileLinks.map((button, i) => (
          <Link href={button.href as any} key={button.label}>
            <View
              style={[
                styles.profileButton,
                i > 0 && styles.profileButtonSeparator,
              ]}
            >
              <Text style={styles.userInfo}>{button.label}</Text>
              <AntDesign name="right" size={24} color={theme.textColor} />
            </View>
          </Link>
        ))}
        <Pressable
          disabled={exportLoading}
          onPress={exportDataHandler}
          style={[styles.profileButton, styles.profileButtonSeparator]}
        >
          <Text style={styles.userInfo}>Export Data</Text>
          {exportLoading && <ActivityIndicator size="small" />}

          <AntDesign name="export" size={24} color={theme.textColor} />
        </Pressable>
        <Pressable
          onPress={signOut}
          style={[styles.profileButton, styles.profileButtonSeparator]}
        >
          <Text style={styles.userInfo}>Sign Out</Text>
          <AntDesign name="logout" size={24} color={theme.red} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      padding: 10,
      alignItems: "center",
      gap: 10,
      backgroundColor: theme.background,
    },
    imageCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: "hidden",
      borderColor: theme.textColor,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textColor,
      textAlign: "center",
    },
    name: {
      fontSize: 32,
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: 10,
      color: theme.textColor,
    },
    userInfo: {
      color: theme.textColor,
    },
    boxesContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    infoBox: {
      height: 100,
      width: "30%",
      borderColor: theme.textColor,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      gap: 5,
      paddingHorizontal: 5,
    },
    infoBoxTitle: {
      textAlign: "center",
      fontWeight: "bold",
      color: theme.textColor,
    },
    infoBoxValue: {
      textAlign: "center",
      color: theme.textColor,
    },
    progressWrapper: {
      width: "100%",
      borderColor: theme.textColor,
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      gap: 10,
    },
    progressInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    progress: {
      width: "100%",
    },
    buttonsWrapper: {
      borderRadius: 10,
      borderColor: theme.textColor,
      borderWidth: 2,
      width: "100%",
    },
    profileButton: {
      width: "100%",
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    profileButtonSeparator: {
      borderTopWidth: 2,
      borderTopColor: theme.textColor,
    },
  });
