import { MeasurementTimeRangeEnum } from "@/types/measurements";

export const corePartsToMeasure = [
  {
    displayName: "Weight",
    label: "weight",
    unit: "kg",
  },
  {
    displayName: "Body Fat",
    label: "body_fat",
    unit: "%",
  },
];

export const bodyPartsToMeasure = [
  {
    displayName: "Neck",
    label: "neck",
    unit: "cm",
  },
  {
    displayName: "Shoulders",
    label: "shoulders",
    unit: "cm",
  },
  {
    displayName: "Chest",
    label: "chest",
    unit: "cm",
  },
  {
    displayName: "Left Biceps",
    label: "left_biceps",
    unit: "cm",
  },
  {
    displayName: "Right Biceps",
    label: "right_biceps",
    unit: "cm",
  },
  {
    displayName: "Left Forearm",
    label: "left_forearm",
    unit: "cm",
  },
  {
    displayName: "Right Forearm",
    label: "right_forearm",
    unit: "cm",
  },
  {
    displayName: "Waist",
    label: "waist",
    unit: "cm",
  },
  {
    displayName: "Stomach",
    label: "stomach",
    unit: "cm",
  },
  {
    displayName: "Hips",
    label: "hips",
    unit: "cm",
  },
  {
    displayName: "Left Thigh",
    label: "left_thigh",
    unit: "cm",
  },
  {
    displayName: "Right Thigh",
    label: "right_thigh",
    unit: "cm",
  },
  {
    displayName: "Left Calf",
    label: "left_calf",
    unit: "cm",
  },
  {
    displayName: "Right Calf",
    label: "right_calf",
    unit: "cm",
  },
];

export const allMetrics = [...corePartsToMeasure, ...bodyPartsToMeasure];
export const timePeriodButtons = [
  { label: "All Time", value: MeasurementTimeRangeEnum.ALL },
  { label: "1 Year", value: MeasurementTimeRangeEnum.ONE_YEAR },
  { label: "6 Months", value: MeasurementTimeRangeEnum.SIX_MONTHS },
  { label: "3 Months", value: MeasurementTimeRangeEnum.THREE_MONTHS },
  { label: "1 Month", value: MeasurementTimeRangeEnum.ONE_MONTH },
];
