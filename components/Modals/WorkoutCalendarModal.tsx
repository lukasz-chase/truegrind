import { useEffect, useMemo } from "react";
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";

import CloseButton from "../CloseButton";
import { Workout } from "@/types/workout";
import {
  WorkoutCalendarPopulated,
  WorkoutCalendarStatusEnum,
} from "@/types/workoutCalendar";
import {
  addWorkoutToLocalCalendar,
  removeWorkoutFromLocalCalendar,
} from "@/lib/calendar";
import {
  deleteWorkoutCalendar,
  upsertWorkoutCalendar,
} from "@/lib/workoutCalendarService";
import useWorkoutCalendar from "@/hooks/useworkoutCalendar";
import CustomDateTimePicker from "../CustomDateTimePicker";
import { generateNewColor } from "@/utils/colors";
import useThemeStore from "@/store/useThemeStore";
import { AppThemeEnum, ThemeColors } from "@/types/user";
import useAppStore from "@/store/useAppStore";

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  pressedDate: { dateString: string; activeWorkoutId: string | undefined };
  workouts: Workout[];
  setWorkoutCalendarData: React.Dispatch<
    React.SetStateAction<WorkoutCalendarPopulated[]>
  >;
  workoutCalendarData: WorkoutCalendarPopulated[];
};

export default function WorkoutCalendarModal({
  isVisible,
  closeModal,
  pressedDate,
  workouts,
  setWorkoutCalendarData,
  workoutCalendarData,
}: Props) {
  const { startTime, endTime, setStartTime, setEndTime, initializeTimes } =
    useWorkoutCalendar(pressedDate, workoutCalendarData);
  const { theme, mode } = useThemeStore((state) => state);
  const { setRefetchProfileData } = useAppStore();

  const styles = useMemo(() => makeStyles(theme), [theme]);
  useEffect(() => {
    initializeTimes();
  }, [pressedDate.dateString]);

  const assignWorkoutToDay = async (workout: Workout) => {
    const existingWorkout = workoutCalendarData.find(
      (data) =>
        data.workout_id === workout.id &&
        data.scheduled_date === pressedDate.dateString
    );

    if (existingWorkout) {
      if (existingWorkout.calendar_event_id) {
        await removeWorkoutFromLocalCalendar(existingWorkout.calendar_event_id);
      }
      await deleteWorkoutCalendar(
        workout.id,
        pressedDate.dateString,
        workout.user_id
      );
      setWorkoutCalendarData(
        workoutCalendarData.filter(
          (w) => w.scheduled_date !== pressedDate.dateString
        )
      );

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setRefetchProfileData();
      closeModal();
      return;
    }
    const calendarData = {
      name: workout.name,
      startDateTime: startTime,
      endDateTime: endTime,
    };
    const eventId = await addWorkoutToLocalCalendar(calendarData);
    const color = generateNewColor(workoutCalendarData.map((w) => w.color));

    const newWorkoutCalendar = {
      user_id: workout.user_id,
      workout_id: workout.id,
      scheduled_date: pressedDate.dateString,
      status: WorkoutCalendarStatusEnum.Scheduled,
      color,
      start_time: startTime,
      end_time: endTime,
      calendar_event_id: eventId,
      workout_history_id: null,
    };

    const populatedData = await upsertWorkoutCalendar(newWorkoutCalendar);
    if (populatedData) {
      setWorkoutCalendarData([...workoutCalendarData, populatedData]);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setRefetchProfileData();
      closeModal();
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <View style={styles.header}>
          <CloseButton onPress={closeModal} />
          <Text style={styles.title}>{pressedDate.dateString}</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>Assign a workout for this day</Text>

        <View style={styles.timePickerContainer}>
          <CustomDateTimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
          />
          <CustomDateTimePicker
            label="End Time"
            value={endTime}
            onChange={setEndTime}
          />
        </View>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.workoutButton,
                {
                  backgroundColor:
                    item.id === pressedDate.activeWorkoutId
                      ? theme.blue
                      : mode === AppThemeEnum.DARK
                      ? theme.black
                      : theme.gray,
                },
              ]}
              onPress={() => assignWorkoutToDay(item)}
            >
              <Text style={styles.workoutButtonText}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      backgroundColor: theme.semiTransparent,
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    modalContent: {
      width: "90%",
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: theme.background,
      margin: "auto",
      maxHeight: 600,
    },
    title: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    subtitle: {
      textAlign: "center",
      fontSize: 18,
      color: theme.textColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 10,
    },
    list: {
      width: "100%",
    },
    listContainer: {
      gap: 10,
    },
    workoutButton: {
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    workoutButtonText: {
      fontSize: 18,
      color: theme.textColor,
    },
    timePickerContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "flex-start",
      marginVertical: 10,
      width: "100%",
    },
  });
