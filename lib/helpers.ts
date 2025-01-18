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
export const count1RM = (weight: number, reps: number) => {
  return weight * (1 + reps / 30);
};

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  return `${formattedDate}`;
};

export const areObjectsDifferent = (obj1: any, obj2: any): boolean => {
  if (typeof obj1 !== "object" || obj1 === null) {
    return obj1 !== obj2; // Direct comparison for non-objects
  }

  if (typeof obj2 !== "object" || obj2 === null) {
    return true; // If one is object and the other is not
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if keys length differs
  if (keys1.length !== keys2.length) {
    return true;
  }

  // Check each key recursively
  return keys1.some((key) => areObjectsDifferent(obj1[key], obj2[key]));
};
