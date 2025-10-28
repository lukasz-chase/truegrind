import { formatTime } from "@/utils/calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TimerStore {
  elapsedTime: number;
  formattedTime: string;
  isRunning: boolean;
  startTimestamp: number | null;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  resumeIfRunning: () => void;
}

const useWorkoutTimer = create<TimerStore>()(
  persist(
    (set, get) => {
      let timer: number | null = null;

      const getNowSec = () => Math.floor(Date.now() / 1000);

      const startTimer = () => {
        if (get().isRunning) return;

        const state = get();
        const nowSec = getNowSec();

        const newStartTimestamp = nowSec - state.elapsedTime;

        // Actually start the interval
        timer = setInterval(() => {
          const currentSec = getNowSec();
          const newElapsedTime =
            currentSec - (get().startTimestamp || currentSec);
          set({
            elapsedTime: newElapsedTime,
            formattedTime: formatTime(newElapsedTime),
          });
        }, 100);

        set({
          isRunning: true,
          startTimestamp: newStartTimestamp,
        });
      };

      const stopTimer = () => {
        if (timer) clearInterval(timer);
        timer = null;
        set({ isRunning: false });
      };

      const resetTimer = () => {
        stopTimer();
        set({
          elapsedTime: 0,
          formattedTime: "0:00",
          startTimestamp: null,
        });
      };

      const resumeIfRunning = () => {
        const state = get();
        if (state.isRunning) {
          if (timer) clearInterval(timer);

          const nowSec = getNowSec();
          const newElapsedTime = nowSec - (state.startTimestamp || nowSec);

          set({
            elapsedTime: newElapsedTime,
            formattedTime: formatTime(newElapsedTime),
          });

          timer = setInterval(() => {
            const currentSec = getNowSec();
            const updatedElapsedTime =
              currentSec - (get().startTimestamp || currentSec);
            set({
              elapsedTime: updatedElapsedTime,
              formattedTime: formatTime(updatedElapsedTime),
            });
          }, 100);
        }
      };

      return {
        elapsedTime: 0,
        formattedTime: "0:00",
        isRunning: false,
        startTimestamp: null,
        startTimer,
        stopTimer,
        resetTimer,
        resumeIfRunning,
      };
    },
    {
      name: "workout-timer",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        elapsedTime: state.elapsedTime,
        formattedTime: state.formattedTime,
        isRunning: state.isRunning,
        startTimestamp: state.startTimestamp,
      }),
    }
  )
);

export default useWorkoutTimer;
