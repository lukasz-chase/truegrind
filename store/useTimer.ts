import { create } from "zustand";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

type TimerState = {
  timerDuration: number; // Total timer duration in seconds
  timeRemaining: number; // Time left in seconds
  isRunning: boolean; // Timer running state
  endTime: number | null; // The time when the timer should end
  startTimer: (timeLength: number) => void;
  addToTimer: (seconds: number) => void;
  reduceFromTimer: (seconds: number) => void;
  endTimer: () => void;
};

const useTimerStore = create<TimerState>()((set, get) => {
  let timer: NodeJS.Timeout | null = null;

  const startTimer = (timeLength: number) => {
    const endTime = Date.now() + timeLength * 1000;

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

      // Handle the case where time runs out immediately
      if (newTimeRemaining === 0) {
        endTimer();
      }
    }
  };

  const endTimer = async () => {
    if (timer) clearInterval(timer);
    if (Platform.OS !== "web") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time's Up!",
          body: "Your timer is complete.",
        },
        trigger: null,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    timer = null; // Reset the timer variable
    set({
      timeRemaining: 0,
      isRunning: false,
      timerDuration: 0,
      endTime: null,
    });
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
