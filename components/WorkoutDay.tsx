import { Text, Pressable, View, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import {
  WorkoutCalendarPopulated,
  WorkoutCalendarStatusEnum,
} from "@/types/workoutCalendar";
import { isPastToday } from "@/utils/calendar";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";

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
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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

  let backgroundColor = theme.background;
  let textColor = theme.textColor;
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
    backgroundColor = theme.blue;
    borderColor = theme.black;
    textColor = theme.white;
  }
  if (isScheduled) {
    backgroundColor = dayData?.color || backgroundColor;
    textColor = theme.white;
  }
  if (isCompleted) {
    backgroundColor = dayData?.color || backgroundColor;
    icon = (
      <Entypo
        name="check"
        size={CALENDAR_ICON_SIZE}
        color={theme.green}
        style={styles.dayIcon}
      />
    );
  }
  if (isMissed) {
    backgroundColor = theme.gray;
    textColor = theme.white;
    icon = (
      <Entypo
        name="cross"
        size={CALENDAR_ICON_SIZE}
        color={theme.red}
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
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
      textShadowColor: theme.black,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
  });
