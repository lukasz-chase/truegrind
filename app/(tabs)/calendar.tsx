import WorkoutCalendarModal from "@/components/Modals/WorkoutCalendarModal";
import { AppColors } from "@/constants/colors";
import {
  fetchUserWorkoutCalendar,
  updateMissedWorkouts,
} from "@/lib/workoutCalendarService";
import userStore from "@/store/userStore";
import useSplitsStore from "@/store/useSplitsStore";
import {
  WorkoutCalendarPopulated,
  WorkoutCalendarStatusEnum,
} from "@/types/workoutCalendar";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import Entypo from "@expo/vector-icons/Entypo";
import useAppStore from "@/store/useAppStore";

type DayDisplay = {
  backgroundColor?: string;
  textColor?: string;
  icon?: JSX.Element | null;
  borderColor?: string;
  textDecoration: "none" | "line-through";
};

const CALENDAR_ICON_SIZE = 18;

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
  const { activeSplit } = useSplitsStore();
  const { user } = userStore();
  const { refetchNumber, refetchData } = useAppStore();

  useEffect(() => {
    getWorkoutCalendarData();
  }, [refetchNumber]);

  useEffect(() => {
    setMissedWorkouts();
  }, []);

  const getWorkoutCalendarData = async () => {
    try {
      const data = await fetchUserWorkoutCalendar(user!.id);
      setWorkoutCalendarData(data);
    } catch (error) {
      console.log(error);
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
    return workoutCalendar?.color;
  };

  const isPastToday = (date: { year: number; month: number; day: number }) => {
    const today = new Date();
    const isSameYear = date.year === today.getFullYear();
    const isSameMonth = date.month === today.getMonth() + 1;

    const isPastThisMonth =
      isSameYear && isSameMonth && date.day < today.getDate();

    return isPastThisMonth;
  };
  const getDayDisplay = (
    date: { year: number; month: number; day: number; dateString: string },
    state: string,
    workoutCalendarData: WorkoutCalendarPopulated[]
  ): DayDisplay => {
    const dayData = workoutCalendarData.find(
      (item) => item.scheduled_date === date.dateString
    );

    const isCompleted = dayData?.status === WorkoutCalendarStatusEnum.Completed;
    const isMissed = dayData?.status === WorkoutCalendarStatusEnum.Missed;
    const isScheduled = dayData?.status === WorkoutCalendarStatusEnum.Scheduled;
    const isDisabled = isPastToday(date);

    const isToday = state === "today";

    let backgroundColor = "transparent";
    let textColor = "black";
    let borderColor = "transparent";
    let textDecoration: "none" | "line-through" = "none";
    let icon = null;
    if (isDisabled) {
      textDecoration = "line-through";
    }
    if (isToday) {
      backgroundColor = AppColors.blue;
      borderColor = "black";
      textColor = "white";
    }
    if (isScheduled) {
      backgroundColor = dayData?.color || backgroundColor;
      textColor = "white";
    }
    if (isCompleted) {
      backgroundColor = AppColors.green;
      textColor = "white";
      icon = <Entypo name="check" size={CALENDAR_ICON_SIZE} color="black" />;
    }
    if (isMissed) {
      backgroundColor = AppColors.gray;
      textColor = "white";
      icon = <Entypo name="cross" size={CALENDAR_ICON_SIZE} color="black" />;
    }

    return { backgroundColor, textColor, icon, borderColor, textDecoration };
  };
  return (
    <SafeAreaView>
      <ScrollView
        style={styles.legend}
        horizontal
        contentContainerStyle={styles.legendContainer}
      >
        {activeSplit.workouts
          .filter((w) =>
            workoutCalendarData.find((workout) => workout.workout_id === w.id)
          )
          .map((workout) => (
            <View
              key={workout.id}
              style={[
                styles.legendItem,
                { backgroundColor: getWorkoutColorByWorkoutId(workout.id) },
              ]}
            >
              <Text style={styles.legendItemText}>{workout.name}</Text>
            </View>
          ))}
      </ScrollView>
      <CalendarList
        pastScrollRange={0}
        futureScrollRange={1}
        dayComponent={({ date, state }: any) => {
          const {
            backgroundColor,
            borderColor,
            icon,
            textColor,
            textDecoration,
          } = getDayDisplay(date, state, workoutCalendarData);
          return (
            <Pressable
              style={[styles.date, { backgroundColor, borderColor }]}
              onPress={() => onDayPressHandler(date)}
              disabled={isPastToday(date)}
            >
              <Text
                style={[
                  styles.dateText,
                  { color: textColor, textDecorationLine: textDecoration },
                ]}
              >
                {date.day}
              </Text>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
            </Pressable>
          );
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

const styles = StyleSheet.create({
  legend: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
  },
  legendContainer: {
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
  },
  legendItemText: {
    color: "white",
  },
  date: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    width: 30,
    height: 30,
  },
  today: {
    backgroundColor: AppColors.blue,
  },
  dateText: {
    textAlign: "center",
  },
  iconContainer: {
    position: "absolute",
    right: -CALENDAR_ICON_SIZE / 2,
    top: -CALENDAR_ICON_SIZE / 2,
  },
});
