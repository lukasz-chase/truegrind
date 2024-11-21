import { create } from "zustand";

interface TimerStore {
  elapsedTime: number;
  formattedTime: string;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const useWorkoutTimer = create<TimerStore>((set, get) => {
  let timer: NodeJS.Timeout | null = null;

  const formatTime = (elapsedTime: number) => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (get().isRunning) return;
    const startTime = Date.now() - get().elapsedTime * 1000;

    timer = setInterval(() => {
      const newElapsedTime = Math.floor((Date.now() - startTime) / 1000);
      set({
        elapsedTime: newElapsedTime,
        formattedTime: formatTime(newElapsedTime),
      });
    }, 100); // Update every 100ms
    set({ isRunning: true });
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
    set({ isRunning: false });
  };

  const resetTimer = () => {
    stopTimer();
    set({ elapsedTime: 0, formattedTime: "0:00" });
  };

  return {
    elapsedTime: 0,
    formattedTime: "0:00",
    isRunning: false,
    startTimer,
    stopTimer,
    resetTimer,
  };
});

export default useWorkoutTimer;
