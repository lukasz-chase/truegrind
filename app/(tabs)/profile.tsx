import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import userStore from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import AnchoredModal from "@/components/Modals/AnchoredModal";
import ModalOptionButton from "@/components/Modals/ModalOptionButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, useRouter } from "expo-router";
import { AppColors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Progress from "react-native-progress";
import { profileButtons } from "@/constants/profile";
import CustomImage from "@/components/CustomImage";
import { fetchUserMeasurementsSingle } from "@/lib/measurementsService";
import { Measurement } from "@/types/measurements";
import {
  fetchUsersLastWorkout,
  fetchWeeklyWorkoutCount,
} from "@/lib/workoutServices";
import { WorkoutHistory } from "@/types/workout";
import { formatDateShort } from "@/lib/helpers";

//TODO - show skeleton while loading
//TODO - use the picker in time pickers aswell
//TODO - make theme usable
//TODO - add animations between pages
//TODO - maybe profile should be lighten up in the bar when we go to the profile subpages
//TODO - change the latest workout for an upcoming one
export default function Profile() {
  const { user } = userStore();
  const [goalMeasurement, setGoalMeasurement] = useState<Measurement | null>(
    null
  );
  const [weight, setWeight] = useState<Measurement | null>(null);
  const [recentWorkout, setRecentWorkout] = useState<WorkoutHistory | null>(
    null
  );
  const [workoutFrequency, setWorkoutFrequency] = useState<number | null>(null);

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
      if (!user?.id) return;

      const [
        goalDataPromise,
        weightDataPromise,
        recentWorkoutDataPromise,
        workoutFrequencyDataPromise,
      ] = [
        user.current_goal?.name
          ? fetchUserMeasurementsSingle(user.id, user.current_goal.name)
          : Promise.resolve(null),
        fetchUserMeasurementsSingle(user.id, "weight"),
        fetchUsersLastWorkout(user.id),
        fetchWeeklyWorkoutCount(user.id),
      ];

      const [goalData, weightData, recentWorkoutData, workoutFrequencyData] =
        await Promise.all([
          goalDataPromise,
          weightDataPromise,
          recentWorkoutDataPromise,
          workoutFrequencyDataPromise,
        ]);

      if (goalData) setGoalMeasurement(goalData);
      if (weightData) setWeight(weightData);
      if (recentWorkoutData) setRecentWorkout(recentWorkoutData);
      if (typeof workoutFrequencyData === "number") {
        setWorkoutFrequency(workoutFrequencyData);
      }
    } catch (error) {
      console.error("Error fetching measurements", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>TRUE GRIND</Text>
      <FontAwesome
        name="user-circle"
        size={100}
        color={AppColors.charcoalGray}
      />
      <Text style={[styles.title, styles.name]}>{user?.username}</Text>
      <View style={styles.infoContainer}>
        {user?.age ? <Text>{user?.age} years</Text> : <Text>Age</Text>}
        <Text>-</Text>
        {user?.height ? <Text>{user?.height} cm</Text> : <Text>Height</Text>}
        <Text>-</Text>
        {weight ? (
          <Text>
            {weight.value} {weight.unit}
          </Text>
        ) : (
          <Text>Weight</Text>
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
          {recentWorkout ? (
            <>
              <Text style={styles.infoBoxValue}>
                {formatDateShort(recentWorkout.created_at!)}
              </Text>
              <Text style={styles.infoBoxTitle}>{recentWorkout.name}</Text>
              <Text style={styles.infoBoxValue}>
                {recentWorkout.workout_time}
              </Text>
            </>
          ) : (
            <Text style={styles.infoBoxTitle}>No recent workout</Text>
          )}
        </View>
      </View>
      <View style={styles.progressWrapper}>
        {goalMeasurement && user?.current_goal?.value ? (
          <>
            <Text style={styles.infoBoxValue}>Goal progress</Text>
            <View style={styles.progressInfo}>
              <Text>{goalMeasurement?.value}</Text>
              <Text>{user?.current_goal?.value}</Text>
            </View>
            <Progress.Bar
              progress={Math.min(
                goalMeasurement?.value / user?.current_goal?.value,
                1
              )}
              width={350}
              color={AppColors.blue}
              style={styles.progress}
            />
          </>
        ) : (
          <Text>No goal set</Text>
        )}
      </View>
      <View style={styles.buttonsWrapper}>
        {profileButtons.map((button, i) => (
          <Link href={button.href} key={button.label}>
            <View
              style={[
                styles.profileButton,
                i > 0 && styles.profileButtonSeparator,
              ]}
            >
              <Text>{button.label}</Text>
              <AntDesign
                name="right"
                size={24}
                color={AppColors.charcoalGray}
              />
            </View>
          </Link>
        ))}
        <Pressable
          onPress={signOut}
          style={[styles.profileButton, styles.profileButtonSeparator]}
        >
          <Text>Sign Out</Text>
          <AntDesign name="logout" size={24} color={AppColors.red} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.black,
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
    borderColor: AppColors.charcoalGray,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    gap: 10,
  },
  infoBoxTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  infoBoxValue: {
    textAlign: "center",
  },
  progressWrapper: {
    width: "100%",
    borderColor: AppColors.charcoalGray,
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
    borderColor: AppColors.charcoalGray,
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
    borderTopColor: AppColors.charcoalGray,
  },
});
