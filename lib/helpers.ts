export const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;
