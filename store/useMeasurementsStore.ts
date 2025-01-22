import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  Measurement,
  MeasurementTimeRange,
  MeasurementTimeRangeEnum,
} from "@/types/measurements";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  removeMeasurement: (measurementId: string, measurementLabel: string) => void;
  getFilteredMeasurements: (range: MeasurementTimeRange) => Measurement[];
};

const useMeasurementsStore = create<Store>()(
  persist(
    (set, get) => ({
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
        const { displayedMeasurements, measurements } = get();
        const foundMeasurement = measurements.find((m) => m.label === label);

        if (foundMeasurement) {
          // If found in measurements, overwrite displayed measurement from the existing item
          displayedMeasurements[label] = {
            value: foundMeasurement.value,
            unit: foundMeasurement.unit,
          };
          set({ displayedMeasurements });
        } else {
          // If not found, remove from displayed measurements
          delete displayedMeasurements[label];
          set({ displayedMeasurements });
        }
      },

      addMeasurement: (measurement) => {
        set((state) => ({
          ...state,
          measurements: [measurement, ...state.measurements].sort((a, b) =>
            a.created_at > b.created_at ? -1 : 1
          ),
        }));
        get().addDisplayedMeasurement(measurement);
      },

      removeMeasurement: (measurementId, measurementLabel) => {
        const { measurements, removeDisplayedMeasurement } = get();
        const filteredMeasurements = measurements.filter(
          (m) => m.id !== measurementId
        );
        set({ measurements: filteredMeasurements });
        removeDisplayedMeasurement(measurementLabel);
      },

      getFilteredMeasurements: (range) => {
        const { measurements } = get();
        if (range === MeasurementTimeRangeEnum.ALL) {
          return measurements;
        }

        const now = new Date();
        return measurements.filter((m) => {
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
      },
    }),
    {
      name: "measurements-storage", // storage key name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        displayedMeasurements: state.displayedMeasurements,
      }),
    }
  )
);

export default useMeasurementsStore;
