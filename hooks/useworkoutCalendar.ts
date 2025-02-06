import { useState } from "react";
import { WorkoutCalendarPopulated } from "@/types/workoutCalendar";

export default function useWorkoutCalendar(
  pressedDate: { dateString: string; activeWorkoutId: string | undefined },
  workoutCalendarData: WorkoutCalendarPopulated[]
) {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const initializeTimes = () => {
    const activeWorkout = workoutCalendarData.find(
      (w) => w.scheduled_date === pressedDate.dateString
    );
    if (activeWorkout) {
      setStartTime(new Date(activeWorkout.start_time));
      setEndTime(new Date(activeWorkout.end_time));
    } else {
      const [year, month, day] = pressedDate.dateString.split("-").map(Number);
      setStartTime(new Date(year, month - 1, day, 16, 0));
      setEndTime(new Date(year, month - 1, day, 17, 30));
    }
  };

  return { startTime, endTime, setStartTime, setEndTime, initializeTimes };
}
