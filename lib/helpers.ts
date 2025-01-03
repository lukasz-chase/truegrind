export const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

export const generateSupersetColor = (
  currentSupersetColors: (string | null)[] | undefined
) => {
  const colors = [
    "#ff6b6b",
    "#48dbfb",
    "#1dd1a1",
    "#feca57",
    "#ff9ff3",
    "#f368e0",
    "#ff6b81",
    "#ff9f43",
    "#ff6b6b",
    "#48dbfb",
    "#1dd1a1",
    "#feca57",
    "#ff9ff3",
    "#f368e0",
    "#ff6b81",
    "#ff9f43",
  ].filter((color) => !currentSupersetColors?.includes(color));
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
