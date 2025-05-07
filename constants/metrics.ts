import {
  BodyPartLabel,
  CorePartsLabel,
  MeasurementTimeRangeEnum,
} from "@/types/measurements";

export const corePartsToMeasure = [
  {
    displayName: "Weight",
    label: CorePartsLabel.WEIGHT,
    unit: "kg",
  },
  {
    displayName: "Body Fat",
    label: CorePartsLabel.BODY_FAT,
    unit: "%",
  },
];

export const bodyPartsToMeasure = [
  { displayName: "Neck", label: BodyPartLabel.NECK, unit: "cm" },
  { displayName: "Shoulders", label: BodyPartLabel.SHOULDERS, unit: "cm" },
  { displayName: "Chest", label: BodyPartLabel.CHEST, unit: "cm" },
  { displayName: "Left Biceps", label: BodyPartLabel.LEFT_BICEPS, unit: "cm" },
  {
    displayName: "Right Biceps",
    label: BodyPartLabel.RIGHT_BICEPS,
    unit: "cm",
  },
  {
    displayName: "Left Forearm",
    label: BodyPartLabel.LEFT_FOREARM,
    unit: "cm",
  },
  {
    displayName: "Right Forearm",
    label: BodyPartLabel.RIGHT_FOREARM,
    unit: "cm",
  },
  { displayName: "Waist", label: BodyPartLabel.WAIST, unit: "cm" },
  { displayName: "Stomach", label: BodyPartLabel.STOMACH, unit: "cm" },
  { displayName: "Hips", label: BodyPartLabel.HIPS, unit: "cm" },
  { displayName: "Left Thigh", label: BodyPartLabel.LEFT_THIGH, unit: "cm" },
  { displayName: "Right Thigh", label: BodyPartLabel.RIGHT_THIGH, unit: "cm" },
  { displayName: "Left Calf", label: BodyPartLabel.LEFT_CALF, unit: "cm" },
  { displayName: "Right Calf", label: BodyPartLabel.RIGHT_CALF, unit: "cm" },
];

export const allMetrics = [...corePartsToMeasure, ...bodyPartsToMeasure];
export const timePeriodButtons = [
  { label: "All Time", value: MeasurementTimeRangeEnum.ALL },
  { label: "1 Year", value: MeasurementTimeRangeEnum.ONE_YEAR },
  { label: "6 Months", value: MeasurementTimeRangeEnum.SIX_MONTHS },
  { label: "3 Months", value: MeasurementTimeRangeEnum.THREE_MONTHS },
  { label: "1 Month", value: MeasurementTimeRangeEnum.ONE_MONTH },
];
