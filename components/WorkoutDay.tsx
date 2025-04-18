import { Text, Pressable, View, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import {
  WorkoutCalendarPopulated,
  WorkoutCalendarStatusEnum,
} from "@/types/workoutCalendar";
import { AppColors } from "@/constants/colors";
import { isPastToday } from "@/utils/calendar";
import { useRouter } from "expo-router";

type Props = {
  date: {
    year: number;
    month: number;
    day: number;
    dateString: string;
    timestamp: number;
  };
  state: string;
  workoutCalendarData: WorkoutCalendarPopulated[];
  onDayPress: (date: any) => void;
  loading: boolean;
};

const CALENDAR_ICON_SIZE = 25;

export default function WorkoutDay({
  date,
  state,
  workoutCalendarData,
  onDayPress,
  loading,
}: Props) {
  if (loading) {
    return (
      <View style={[styles.date, { borderColor: "transparent" }]}>
        <Text style={styles.dateText}>...</Text>
      </View>
    );
  }
  const router = useRouter();
  const dayData = workoutCalendarData.find(
    (item) => item.scheduled_date === date.dateString
  );
  const isCompleted = dayData?.status === WorkoutCalendarStatusEnum.Completed;
  const isMissed = dayData?.status === WorkoutCalendarStatusEnum.Missed;
  const isScheduled = dayData?.status === WorkoutCalendarStatusEnum.Scheduled;
  const isDisabled = isPastToday(date);
  const isToday = state === "today";

  let backgroundColor = "transparent";
  let textColor = AppColors.black;
  let borderColor = "transparent";
  let textDecoration: "none" | "line-through" = "none";
  let icon = null;

  const onDayPressWrapper = (date: any) => {
    if (
      (isDisabled && dayData?.workout_history_id) ||
      (isCompleted && isToday)
    ) {
      router.push(`/(tabs)/workoutHistory/${dayData?.workout_history_id}`);
      return;
    } else if (isDisabled) {
      return;
    }
    onDayPress(date);
  };

  if (isDisabled) textDecoration = "line-through";
  if (isToday) {
    backgroundColor = AppColors.blue;
    borderColor = AppColors.black;
    textColor = AppColors.white;
  }
  if (isScheduled) {
    backgroundColor = dayData?.color || backgroundColor;
    textColor = AppColors.white;
  }
  if (isCompleted) {
    backgroundColor = dayData?.color || backgroundColor;
    icon = (
      <Entypo
        name="check"
        size={CALENDAR_ICON_SIZE}
        color={AppColors.green}
        style={styles.dayIcon}
      />
    );
  }
  if (isMissed) {
    backgroundColor = AppColors.gray;
    textColor = AppColors.white;
    icon = (
      <Entypo
        name="cross"
        size={CALENDAR_ICON_SIZE}
        color={AppColors.red}
        style={styles.dayIcon}
      />
    );
  }

  return (
    <Pressable
      style={[styles.date, { backgroundColor, borderColor }]}
      onPress={() => onDayPressWrapper(date)}
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
}

const styles = StyleSheet.create({
  date: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    textAlign: "center",
    fontSize: 20,
  },
  iconContainer: {
    position: "absolute",
    right: -CALENDAR_ICON_SIZE / 2,
    top: -CALENDAR_ICON_SIZE / 2,
  },
  dayIcon: {
    textShadowColor: AppColors.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
