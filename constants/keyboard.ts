import { BarTypeEnum } from "@/types/exercisesSets";

export const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
export const rpeValues = [
  {
    value: 6,
    label:
      "You could do 4 or more reps. RPE values under 6 are difficult to estimate accurately.",
  },
  {
    value: 6.5,
    label: "You could perform 3-4 more reps before reaching failure.",
  },
  {
    value: 7,
    label: "You could comfortably perform 3 more reps.",
  },
  {
    value: 7.5,
    label: "You could perform 2-3 more reps before reaching failure",
  },
  {
    value: 8,
    label: "You could comfortably perform 2 more reps",
  },
  {
    value: 8.5,
    label: "You could perform 1-2 more reps before reaching failure",
  },
  {
    value: 9,
    label: "You could comfortably perform 1 more rep",
  },
  {
    value: 9.5,
    label: "You could possibly do 1 more rep before reaching failure",
  },
  {
    value: 10,
    label: "Maximum exertion. No more reps possible",
  },
];
export const KEYBOARD_HEIGHT = 270;
export const barTypes = [
  {
    name: BarTypeEnum.MEN_OLYMPIC_BAR,
    weight: 20,
    image: "womens_olympic_bar.png",
  },
  {
    name: BarTypeEnum.WOMEN_OLYMPIC_BAR,
    weight: 15,
    image: "mens_olympic_bar.png",
  },
  {
    name: BarTypeEnum.EZ_CURL_BAR,
    weight: 10,
    image: "ez_curl_bar.png",
  },
  {
    name: BarTypeEnum.TRICEPS_BAR,
    weight: 10,
    image: "triceps_bar.png",
  },
  {
    name: BarTypeEnum.TRAP_BAR,
    weight: 25,
    image: "trap_bar.png",
  },
  {
    name: BarTypeEnum.SQUAT_SAFETY_BAR,
    weight: 32,
    image: "squat_safety_bar.png",
  },
];
