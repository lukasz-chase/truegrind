import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import CloseButton from "../CloseButton";
import { Workout } from "@/types/workout";
import { AppColors } from "@/constants/colors";
import {
  deleteWorkoutCalendar,
  upsertWorkoutCalendar,
} from "@/lib/workoutCalendarService";
import {
  WorkoutCalendarPopulated,
  WorkoutCalendarStatusEnum,
} from "@/types/workoutCalendar";
import { generateNewColor } from "@/lib/helpers";
import * as Haptics from "expo-haptics";
import {
  addWorkoutToLocalCalendar,
  removeWorkoutFromLocalCalendar,
} from "@/lib/calendar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";

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
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    const dateStr = pressedDate.dateString;
    const [year, month, day] = dateStr.split("-").map(Number);
    const newStartTime = new Date(year, month - 1, day, 9, 0);
    const newEndTime = new Date(year, month - 1, day, 10, 30);
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  }, [pressedDate.dateString]);

  const getWorkoutColorByWorkoutId = (workoutId: string) => {
    const workoutCalendar = workoutCalendarData.find((workout) => {
      return workout.workout_id === workoutId;
    });
    return workoutCalendar?.color;
  };
  const addWorkoutToCalendar = (
    newWorkoutCalendarData: WorkoutCalendarPopulated
  ) => {
    const previousWorkoutIndexForThisDate = workoutCalendarData.findIndex(
      (workout) => {
        return workout.scheduled_date === newWorkoutCalendarData.scheduled_date;
      }
    );
    if (previousWorkoutIndexForThisDate !== -1) {
      const updatedWorkoutCalendarData = [...workoutCalendarData];
      updatedWorkoutCalendarData[previousWorkoutIndexForThisDate] =
        newWorkoutCalendarData;
      setWorkoutCalendarData(updatedWorkoutCalendarData);
      return;
    }
    setWorkoutCalendarData((prev) => [...prev, newWorkoutCalendarData]);
  };
  const removeWorkoutFromCalendar = (scheduledDate: string) => {
    const updatedWorkoutCalendarData = workoutCalendarData.filter((workout) => {
      return workout.scheduled_date !== scheduledDate;
    });
    setWorkoutCalendarData(updatedWorkoutCalendarData);
  };
  const assignWorkoutToDay = async (workout: Workout) => {
    const alreadyInCalendar = workoutCalendarData.find((data) => {
      return (
        data.workout_id === workout.id &&
        data.scheduled_date === pressedDate.dateString
      );
    });
    if (alreadyInCalendar) {
      await removeWorkoutFromLocalCalendar(alreadyInCalendar.calendar_event_id);
      removeWorkoutFromCalendar(pressedDate.dateString);
      deleteWorkoutCalendar(
        workout.id,
        pressedDate.dateString,
        workout.user_id
      );
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      closeModal();
      return;
    }
    const currentColors = workoutCalendarData.map((data) => data.color);
    const workoutInCalendarColor = getWorkoutColorByWorkoutId(workout.id);
    const color = workoutInCalendarColor
      ? workoutInCalendarColor
      : generateNewColor(currentColors);
    const calendarData = {
      name: workout.name,
      startDateTime: startTime,
      endDateTime: endTime,
    };
    const eventId = await addWorkoutToLocalCalendar(calendarData);
    console.log({ eventId });
    const workoutCalendar = {
      user_id: workout.user_id,
      workout_id: workout.id,
      scheduled_date: pressedDate.dateString,
      status: WorkoutCalendarStatusEnum.Scheduled,
      color,
      start_time: startTime,
      end_time: endTime,
      calendar_event_id: eventId,
    };
    const workoutCalendarPopulated = await upsertWorkoutCalendar(
      workoutCalendar
    );
    if (workoutCalendarPopulated) {
      addWorkoutToCalendar(workoutCalendarPopulated);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      closeModal();
    }
  };

  return (
    <Modal
      transparent={true}
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
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          Assign a workout for this day
        </Text>
        <View style={styles.timePickerContainer}>
          <Text style={styles.timePickerLabel}>Start Time:</Text>
          <DateTimePicker
            value={startTime}
            mode="time"
            onChange={(event, date) => date && setStartTime(date)}
            style={styles.timePicker}
          />
          <Text style={styles.timePickerLabel}>End Time:</Text>
          <DateTimePicker
            value={endTime}
            mode="time"
            onChange={(event, date) => date && setEndTime(date)}
            style={styles.timePicker}
            accentColor={AppColors.black}
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
                    getWorkoutColorByWorkoutId(item.id) || AppColors.gray,
                  borderColor:
                    item.id === pressedDate.activeWorkoutId
                      ? AppColors.black
                      : "transparent",
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

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  modalContent: {
    width: "90%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    gap: 20,
    margin: "auto",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
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
    width: "100%",
    borderWidth: 2,
  },
  workoutButtonText: {
    fontSize: 18,
  },
  timePickerContainer: {
    width: "100%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timePicker: {
    width: "100%",
  },
});
