export const isPastToday = (date: {
  year: number;
  month: number;
  day: number;
}) => {
  const today = new Date();
  const isSameYear = date.year === today.getFullYear();
  const isSameMonth = date.month === today.getMonth() + 1;

  const isPastThisMonth =
    isSameYear && isSameMonth && date.day < today.getDate();

  return isPastThisMonth;
};
