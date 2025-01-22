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

export type MeasurementTimeRange = `${MeasurementTimeRangeEnum}`;
