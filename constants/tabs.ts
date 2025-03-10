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
    name: "splits",
    additionalOptions: {
      animation: "shift" as "shift",
      tabBarStyle: { display: "none" as "none" }, // Explicitly cast "none"
    },
  },
  {
    name: "newSplit",
    additionalOptions: {
      animation: "shift" as "shift",
      tabBarStyle: { display: "none" as "none" }, // Explicitly cast "none"
    },
  },
  {
    name: "workoutFinished",
    additionalOptions: {},
  },
  {
    name: "userForm",
    additionalOptions: {},
  },
  {
    name: "metrics/[id]",
    additionalOptions: {},
  },
  {
    name: "workoutHistory/[id]",
    additionalOptions: {},
  },
  {
    name: "template/[id]",
    additionalOptions: {
      tabBarStyle: { display: "none" as "none" }, // Explicitly cast "none"
    },
  },
];
