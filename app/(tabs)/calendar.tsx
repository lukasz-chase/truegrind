import WorkoutCalendarModal from "@/components/Modals/WorkoutCalendarModal";
import {
  fetchUserWorkoutCalendar,
  updateMissedWorkouts,
} from "@/lib/workoutCalendarService";
import userStore from "@/store/userStore";
import useSplitsStore from "@/store/useSplitsStore";
import { WorkoutCalendarPopulated } from "@/types/workoutCalendar";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import WorkoutDay from "@/components/WorkoutDay";
import LegendItem from "@/components/LegendItem";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarSkeleton from "@/components/Skeletons/CalendarSkeleton";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

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
  const [filteredWorkoutId, setFilteredWorkoutId] = useState<string | null>(
    null,
  );

  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { activeSplit } = useSplitsStore();
  const { user } = userStore();
  const router = useRouter();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setWorkoutCalendarData([]);
      setLoading(false);
      return;
    }

    let isActive = true;
    const loadCalendar = async () => {
      try {
        setLoading(true);
        await updateMissedWorkouts(userId);
        const data = await fetchUserWorkoutCalendar(userId, currentMonth);
        if (isActive) {
          setWorkoutCalendarData(data);
        }
      } catch (error) {
        console.error("Unable to load workout calendar:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadCalendar();

    return () => {
      isActive = false;
    };
  }, [currentMonth, userId]);

  useEffect(() => {
    if (!activeSplit) {
      router.replace("/splits");
    }
  }, [activeSplit, router]);

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

    return workoutCalendar?.color ?? theme.darkGray;
  };

  const handleLegendPress = (workoutId: string) => {
    setFilteredWorkoutId((prev) => (prev === workoutId ? null : workoutId));
  };

  const filteredCalendarData = useMemo(() => {
    if (!filteredWorkoutId) return workoutCalendarData;
    return workoutCalendarData.filter(
      (w) => w.workout_id === filteredWorkoutId,
    );
  }, [workoutCalendarData, filteredWorkoutId]);

  if (!activeSplit) {
    return null;
  }

  const getUniqueCalendarData = () => {
    return workoutCalendarData.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.workout_id === item.workout_id),
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
                onPress={() => handleLegendPress(workoutCalendar.workout_id)}
                color={getWorkoutColorByWorkoutId(workoutCalendar.workout_id)}
                workoutName={
                  workoutCalendar.workout_history?.name ??
                  workoutCalendar.workouts.name
                }
                isActive={filteredWorkoutId === workoutCalendar.workout_id}
                isFiltered={!!filteredWorkoutId}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <Calendar
        key={theme.background}
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
              workoutCalendarData={filteredCalendarData}
              loading={loading}
            />
          );
        }}
        style={styles.calendar}
        theme={{
          calendarBackground: theme.background,
          monthTextColor: theme.textColor,
        }}
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
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: theme.background,
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
      backgroundColor: theme.background,
    },
  });
