export const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

export const generateNewColor = (
  currentColors: (string | null)[] | undefined
) => {
  // Curated palette with 24 distinct colors
  const colorPalette = [
    "#FF6B6B",
    "#48DBFB",
    "#1DD1A1",
    "#FECA57", // Original colors
    "#FF9FF3",
    "#F368E0",
    "#2ECC71",
    "#9B59B6", // Added new
    "#3498DB",
    "#E74C3C",
    "#FFA500",
    "#00CED1", // Blues/Oranges/Cyans
    "#7FFFD4",
    "#DA70D6",
    "#CD5C5C",
    "#00FA9A", // Earth tones
    "#8A2BE2",
    "#FF1493",
    "#32CD32",
    "#8B4513", // Vivid colors
    "#4682B4",
    "#DAA520",
    "#808000",
    "#6B8E23", // Muted tones
    "#4B0082",
    "#9932CC", // Purples
  ];

  const availableColors = colorPalette.filter(
    (color) => !(currentColors || []).includes(color)
  );

  // Fallback strategies if all colors are used
  if (availableColors.length === 0) {
    // Option 1: Return a random color not in original palette
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  return availableColors[Math.floor(Math.random() * availableColors.length)];
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

export const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

export const getCalendarDateFormat = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
