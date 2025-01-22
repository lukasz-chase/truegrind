import {
  Measurement,
  MeasurementTimeRange,
  MeasurementTimeRangeEnum,
} from "@/types/measurements";
import { create } from "zustand";

type Store = {
  displayedMeasurements: {
    [key: string]: { value: number; unit: string };
  };
  setDisplayedMeasurements: (measurements: {
    [key: string]: { value: number; unit: string };
  }) => void;
  addDisplayedMeasurement: (measurement: {
    label: string;
    value: number;
    unit: string;
  }) => void;
  removeDisplayedMeasurement: (label: string) => void;
  measurements: Measurement[];
  setMeasurements: (measurements: Measurement[]) => void;
  addMeasurement: (measurement: Measurement) => void;
  removeMeasurement: (measurementId: string, measurementLabe: string) => void;
  getFilteredMeasurements: (range: MeasurementTimeRange) => Measurement[];
};

const useMeasurementsStore = create<Store>((set, get) => ({
  displayedMeasurements: {},
  measurements: [],
  setDisplayedMeasurements: (measurements) =>
    set({ displayedMeasurements: measurements }),
  setMeasurements: (measurements) => set({ measurements }),
  addDisplayedMeasurement: (measurement) =>
    set((state) => ({
      ...state,
      displayedMeasurements: {
        ...state.displayedMeasurements,
        [measurement.label]: measurement,
      },
    })),
  removeDisplayedMeasurement: (label) => {
    const displayedMeasurements = get().displayedMeasurements;
    const measurements = get().measurements;
    const foundMeasurement = measurements.find((m) => m.label === label);
    if (foundMeasurement) {
      displayedMeasurements[label] = {
        value: foundMeasurement.value,
        unit: foundMeasurement.unit,
      };
      set({ displayedMeasurements });
    } else {
      delete displayedMeasurements[label];
      set({ displayedMeasurements });
    }
  },
  addMeasurement: (measurement) =>
    set((state) => ({
      ...state,
      measurements: [measurement, ...state.measurements],
    })),
  removeMeasurement: (measurementId, measurementLabel) => {
    const measurements = get().measurements.filter(
      (m) => m.id !== measurementId
    );
    set({ measurements });
    get().removeDisplayedMeasurement(measurementLabel);
  },
  getFilteredMeasurements: (range) => {
    const measurements = get().measurements;
    if (range === MeasurementTimeRangeEnum.ALL) {
      return measurements;
    }
    const now = new Date();
    const filteredData = measurements.filter((m) => {
      const measurementDate = new Date(m.created_at);

      switch (range) {
        case MeasurementTimeRangeEnum.ONE_YEAR:
          return (
            measurementDate >=
            new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          );
        case MeasurementTimeRangeEnum.SIX_MONTHS:
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return measurementDate >= sixMonthsAgo;
        case MeasurementTimeRangeEnum.THREE_MONTHS:
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return measurementDate >= threeMonthsAgo;
        case MeasurementTimeRangeEnum.ONE_MONTH:
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return measurementDate >= oneMonthAgo;
        default:
          return true;
      }
    });

    return filteredData;
  },
}));

export default useMeasurementsStore;
