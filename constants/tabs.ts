export const NAVIGATION_DATA: {
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
export const HIDDEN_SCREENS = [
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
    name: "workoutHistory/[id]",
    additionalOptions: {},
  },
  {
    name: "template/[folderId]/[id]",
    additionalOptions: {
      tabBarStyle: { display: "none" as "none" }, // Explicitly cast "none"
    },
  },
];
export const PROFILE_TABS = [
  {
    name: "index",
    animation: "slide_from_left",
  },
  {
    name: "privacy",
    animation: "slide_from_right",
  },
  {
    name: "theme",
    animation: "slide_from_right",
  },
  {
    name: "userForm",
    animation: "slide_from_right",
  },
];
