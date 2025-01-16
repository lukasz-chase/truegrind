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

export const getOrdinalSuffix = (number: number) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  let suffix = "th";
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${number}${suffix}`;
  }

  switch (lastDigit) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
      break;
  }

  return `${number}${suffix}`;
};
