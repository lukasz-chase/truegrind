import { create } from "zustand";
import { persist } from "zustand/middleware";

type TimerState = {
  timeRemaining: number; // Time left in seconds
  isRunning: boolean; // Timer running state
  intervalId: NodeJS.Timeout | null; // Reference to the timer interval
  startTimer: (timeLength: number) => void;
  addToTimer: (seconds: number) => void;
  reduceFromTimer: (seconds: number) => void;
  endTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
};

const useTimerStore = create<TimerState>()(
  persist<TimerState>(
    (set, get) => ({
      timeRemaining: 0,
      isRunning: false,
      intervalId: null,

      startTimer: (timeLength) => {
        const existingInterval = get().intervalId;
        if (existingInterval) clearInterval(existingInterval);

        set({ timeRemaining: timeLength, isRunning: true });

        const interval = setInterval(() => {
          const { timeRemaining, isRunning, endTimer } = get();
          if (!isRunning) return;

          if (timeRemaining <= 1) {
            endTimer();
          } else {
            set((state) => ({ timeRemaining: state.timeRemaining - 1 }));
          }
        }, 1000);

        set({ intervalId: interval });
      },

      addToTimer: (seconds) => {
        set((state) => ({
          timeRemaining: state.timeRemaining + seconds,
        }));
      },

      reduceFromTimer: (seconds) => {
        set((state) => ({
          timeRemaining: Math.max(state.timeRemaining - seconds, 0),
        }));
      },

      endTimer: () => {
        const interval = get().intervalId;
        if (interval) clearInterval(interval);

        set({ timeRemaining: 0, isRunning: false, intervalId: null });
      },

      pauseTimer: () => {
        const interval = get().intervalId;
        if (interval) clearInterval(interval);

        set({ isRunning: false, intervalId: null });
      },

      resumeTimer: () => {
        const { timeRemaining, isRunning, startTimer } = get();
        if (!isRunning && timeRemaining > 0) {
          startTimer(timeRemaining);
        }
      },
    }),
    {
      name: "timer-storage", // Key for localStorage
    }
  )
);

export default useTimerStore;
