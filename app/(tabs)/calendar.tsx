import WorkoutCalendarModal from "@/components/Modals/WorkoutCalendarModal";
import {
  fetchUserWorkoutCalendar,
  updateMissedWorkouts,
} from "@/lib/workoutCalendarService";
import userStore from "@/store/userStore";
import useSplitsStore from "@/store/useSplitsStore";
import { WorkoutCalendarPopulated } from "@/types/workoutCalendar";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import useAppStore from "@/store/useAppStore";
import WorkoutDay from "@/components/WorkoutDay";
import LegendItem from "@/components/LegendItem";
import { AppColors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarSkeleton from "@/components/Skeletons/CalendarSkeleton";

export default function CalendarScreen() {
  const [isWorkoutCalendarModalVisible, setIsWorkoutCalendarModalVisible] =
    useState(false);
  const [pressedDate, setPressedDate] = useState<{
    dateString: string;
    activeWorkoutId: string | undefined;
  }>({ dateString: "", activeWorkoutId: undefined });
  const [workoutCalendarData, setWorkoutCalendarData] = useState<
    WorkoutCalendarPopulated[]
  >([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  const { activeSplit } = useSplitsStore();
  const { user } = userStore();
  const { refetchNumber, refetchData } = useAppStore();

  useEffect(() => {
    getWorkoutCalendarData();
  }, [refetchNumber]);

  useEffect(() => {
    setMissedWorkouts();
  }, [currentMonth]);

  const getWorkoutCalendarData = async () => {
    try {
      setLoading(true);
      const data = await fetchUserWorkoutCalendar(user!.id, currentMonth);
      setWorkoutCalendarData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const setMissedWorkouts = async () => {
    try {
      const data = await updateMissedWorkouts(user!.id);
      if (data) refetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  if (!activeSplit) {
    router.push("/splits");
    return;
  }

  const onDayPressHandler = (day: any) => {
    const workout = workoutCalendarData.find((workout) => {
      return workout.scheduled_date === day.dateString;
    });
    setPressedDate({
      dateString: day.dateString,
      activeWorkoutId: workout?.workout_id,
    });
    setIsWorkoutCalendarModalVisible(true);
  };

  const getWorkoutColorByWorkoutId = (workoutId: string) => {
    const workoutCalendar = workoutCalendarData.find((workout) => {
      return workout.workout_id === workoutId;
    });

    return workoutCalendar?.color ?? AppColors.darkGray;
  };

  const getUniqueCalendarData = () => {
    return workoutCalendarData.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.workout_id === item.workout_id)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexGrow: 0 }}>
        {loading ? (
          <CalendarSkeleton parentStyles={styles} />
        ) : (
          <ScrollView
            style={styles.legendsWrapper}
            contentContainerStyle={styles.legendsContainer}
          >
            {getUniqueCalendarData().map((workoutCalendar) => (
              <LegendItem
                key={workoutCalendar.id}
                color={getWorkoutColorByWorkoutId(workoutCalendar.workout_id)}
                workoutName={
                  workoutCalendar.workout_history?.name ??
                  workoutCalendar.workouts.name
                }
              />
            ))}
          </ScrollView>
        )}
      </View>

      <Calendar
        firstDay={1}
        onMonthChange={({ month }: any) => {
          setCurrentMonth(month);
        }}
        dayComponent={({ date, state }: any) => {
          return (
            <WorkoutDay
              date={date}
              state={state}
              onDayPress={onDayPressHandler}
              workoutCalendarData={workoutCalendarData}
              loading={loading}
            />
          );
        }}
        style={styles.calendar}
      />
      <WorkoutCalendarModal
        closeModal={() => setIsWorkoutCalendarModalVisible(false)}
        isVisible={isWorkoutCalendarModalVisible}
        pressedDate={pressedDate}
        workouts={activeSplit!.workouts}
        setWorkoutCalendarData={setWorkoutCalendarData}
        workoutCalendarData={workoutCalendarData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: AppColors.white,
  },
  legendsWrapper: {
    width: "100%",
    padding: 10,
    maxHeight: 150,
  },
  legendsContainer: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendar: {
    marginVertical: "auto",
  },
});
