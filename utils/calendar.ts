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
