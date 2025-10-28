import { create } from "zustand";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

type TimerState = {
  timerDuration: number; // Total timer duration in seconds
  timeRemaining: number; // Time left in seconds
  isRunning: boolean; // Timer running state
  endTime: number | null; // The time when the timer should end
  startTimer: (timeLength: number) => Promise<void>;
  addToTimer: (seconds: number) => void;
  reduceFromTimer: (seconds: number) => void;
  endTimer: () => void;
};

const useTimerStore = create<TimerState>()((set, get) => {
  let timer: number | null = null;
  let notificationId: string | null = null;

  const startTimer = async (timeLength: number) => {
    const endTime = Date.now() + timeLength * 1000;
    if (Platform.OS !== "web") {
      if (notificationId) {
        // Cancel the old notification if it exists
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }

      scheduleNotification(timeLength);
    }

    // Start the countdown timer
    timer = setInterval(() => {
      const { endTime } = get();
      if (!endTime) return;

      const timeRemaining = Math.max(
        Math.floor((endTime - Date.now()) / 1000),
        0
      );

      if (timeRemaining <= 0) {
        endTimer();
      } else {
        set({ timeRemaining });
      }
    }, 1000);

    set({
      timerDuration: timeLength,
      timeRemaining: timeLength,
      isRunning: true,
      endTime,
    });
  };

  const addToTimer = (seconds: number) => {
    const { endTime, timeRemaining, timerDuration } = get();
    if (endTime) {
      const newEndTime = endTime + seconds * 1000;
      const newTimeRemaining = timeRemaining + seconds;

      set({
        endTime: newEndTime,
        timeRemaining: newTimeRemaining,
        timerDuration: timerDuration + seconds,
      });

      // Cancel and reschedule the notification
      if (notificationId) {
        Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      scheduleNotification(newTimeRemaining);
    }
  };

  const reduceFromTimer = (seconds: number) => {
    const { endTime, timeRemaining, timerDuration } = get();
    if (endTime) {
      const newEndTime = Math.max(endTime - seconds * 1000, Date.now());
      const newTimeRemaining = Math.max(timeRemaining - seconds, 0);

      set({
        endTime: newEndTime,
        timeRemaining: newTimeRemaining,
        timerDuration: Math.max(timerDuration - seconds, 0),
      });

      // Cancel and reschedule the notification
      if (notificationId) {
        Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      if (newTimeRemaining > 0) {
        scheduleNotification(newTimeRemaining);
      } else {
        endTimer();
      }
    }
  };

  const endTimer = async () => {
    if (timer) clearInterval(timer);

    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    notificationId = null; // Reset the notification variable
    timer = null; // Reset the timer variable

    set({
      timeRemaining: 0,
      isRunning: false,
      timerDuration: 0,
      endTime: null,
    });
  };

  const scheduleNotification = async (timeRemaining: number) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's Up!",
        body: "Your timer is complete.",
        sound: "bell.mp3",
      },
      trigger: {
        seconds: timeRemaining,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });
    notificationId = id;
  };

  return {
    timerDuration: 0,
    timeRemaining: 0,
    isRunning: false,
    endTime: null,
    startTimer,
    addToTimer,
    reduceFromTimer,
    endTimer,
  };
});

export default useTimerStore;
