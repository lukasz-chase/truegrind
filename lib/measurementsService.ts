import { Measurement } from "@/types/measurements";
import { supabase } from "./supabase";
import { bodyPartsToMeasure, corePartsToMeasure } from "@/constants/metrics";

export const fetchAllUserMeasurements = async (userId: string) => {
  const allMetrics = [...corePartsToMeasure, ...bodyPartsToMeasure];

  const measurementsArray = await Promise.all(
    allMetrics.map(async (metric) => {
      const data = await fetchUserMeasurementsSingle(userId, metric.label);

      return data ?? null;
    })
  );

  const filteredArray = measurementsArray.filter(Boolean);

  const measurementsObject = (filteredArray as unknown as Measurement[]).reduce(
    (acc, measurement) => {
      acc[measurement.label] = {
        unit: measurement.unit,
        value: measurement.value,
      };
      return acc;
    },
    {} as Record<string, { unit: string; value: number }>
  );

  return measurementsObject;
};

export const fetchUserMeasurements = async (userId: string, label: string) => {
  const { data, error } = await supabase
    .from("measurements")
    .select("*")
    .eq("user_id", userId)
    .eq("label", label)
    .order("created_at", { ascending: false })
    .returns<Measurement[]>();
  if (error) console.log(error);
  if (data) return data;
};

export const fetchUserMeasurementsSingle = async (
  userId: string,
  label: string
) => {
  const { data, error } = await supabase
    .from("measurements")
    .select("label, value, unit")
    .eq("user_id", userId)
    .eq("label", label)
    .order("created_at", { ascending: false })
    .limit(1)
    .returns<Measurement>()
    .single();
  if (error) console.log(error);
  if (data) return data;
};
export const createMeasurement = async (measurement: Partial<Measurement>) => {
  const { data, error } = await supabase
    .from("measurements")
    .insert(measurement)
    .select("*")
    .returns<Measurement[]>();
  if (error) console.log(error);
  if (data) return data[0];
};
