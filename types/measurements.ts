export type Measurement = {
  id: string;
  user_id: string;
  label: string;
  value: number;
  unit: string;
  display_name: string;
  created_at: string;
};

export enum MeasurementTimeRangeEnum {
  ALL = "all",
  ONE_YEAR = "1y",
  SIX_MONTHS = "6m",
  THREE_MONTHS = "3m",
  ONE_MONTH = "1m",
}

export enum BodyPartLabel {
  NECK = "neck",
  SHOULDERS = "shoulders",
  CHEST = "chest",
  LEFT_BICEPS = "left_biceps",
  RIGHT_BICEPS = "right_biceps",
  LEFT_FOREARM = "left_forearm",
  RIGHT_FOREARM = "right_forearm",
  WAIST = "waist",
  STOMACH = "stomach",
  HIPS = "hips",
  LEFT_THIGH = "left_thigh",
  RIGHT_THIGH = "right_thigh",
  LEFT_CALF = "left_calf",
  RIGHT_CALF = "right_calf",
}
export enum CorePartsLabel {
  WEIGHT = "weight",
  BODY_FAT = "body_fat",
}

export type MeasurementTimeRange = `${MeasurementTimeRangeEnum}`;
