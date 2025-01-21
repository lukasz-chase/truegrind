export const NavigationData: {
  name: string;
  icon: any;
  focusedIcon: any;
  title: string;
}[] = [
  {
    name: "profile",
    title: "profile",
    icon: "user-o",
    focusedIcon: "user",
  },
  {
    name: "metrics",
    title: "metrics",
    icon: "bar-chart-o",
    focusedIcon: "bar-chart",
  },
  {
    name: "index",
    title: "workout",
    icon: "plus-square-o",
    focusedIcon: "plus-square",
  },
  {
    name: "exercises",
    title: "exercises",
    icon: "pied-piper",
    focusedIcon: "pied-piper",
  },
  {
    name: "calendar",
    title: "calendar",
    icon: "calendar-o",
    focusedIcon: "calendar",
  },
];
export const hiddenScreens = [
  {
    name: "workoutFinished",
  },
  {
    name: "userForm",
  },
  {
    name: "metrics/[id]",
  },
];
