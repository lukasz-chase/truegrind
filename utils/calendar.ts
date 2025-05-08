export const isPastToday = (date: {
  year: number;
  month: number;
  day: number;
  timestamp: number;
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateToCheck = date.timestamp
    ? new Date(date.timestamp)
    : new Date(date.year, date.month - 1, date.day);
  return dateToCheck < today;
};

export const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

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

export const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const delta = (day + 6) % 7;
  const start = new Date(date);
  start.setDate(date.getDate() - delta);
  start.setHours(0, 0, 0, 0);
  return start;
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
