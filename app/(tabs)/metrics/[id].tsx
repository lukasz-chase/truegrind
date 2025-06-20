import {
  createMeasurement,
  deleteMeasurement,
  fetchUserMeasurements,
} from "@/lib/measurementsService";
import userStore from "@/store/userStore";
import { Measurement, MeasurementTimeRange } from "@/types/measurements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Text, StyleSheet, View, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddMetricsModal from "@/components/Modals/AddMetricsModal";
import { ALL_METRICS, TIME_PERIOD_BUTTONS } from "@/constants/metrics";
import { LineChart } from "react-native-chart-kit";
import { CHART_CONFIG } from "@/constants/chart";
import useMeasurementsStore from "@/store/useMeasurementsStore";
import SwipeToDelete from "@/components/SwipeToDelete";
import CustomHeader from "@/components/CustomHeader";
import { SCREEN_WIDTH } from "@/constants/device";
import { formatDate, formatDateShort } from "@/utils/calendar";
import { AppTheme, AppThemeEnum, ThemeColors } from "@/types/user";
import useThemeStore from "@/store/useThemeStore";

export default function MetricsDetails() {
  const [isMetricsModalVisible, setIsMetricsModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] =
    useState<MeasurementTimeRange>("all");

  const { id } = useLocalSearchParams();
  const { user } = userStore();
  const {
    getFilteredMeasurements,
    setMeasurements,
    addMeasurement,
    removeMeasurement,
  } = useMeasurementsStore();
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme, mode), [theme, mode]);
  const measurement = ALL_METRICS.find((m) => m.label === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const data = await fetchUserMeasurements(user.id, id as string);
          if (data) {
            setMeasurements(data);
          }
        }
      } catch (error) {
        console.error("Error fetching measurements", error);
      }
    };
    fetchData();
  }, [user, id]);

  if (!measurement) return null;

  const addMeasurementHandler = async (value: number) => {
    const data = await createMeasurement({
      label: measurement.label,
      unit: measurement.unit,
      value,
      display_name: measurement.displayName,
      user_id: user?.id!,
    });

    if (data) {
      addMeasurement(data);
    }
  };

  const calculateDifference = (
    value: number,
    index: number,
    arr: Measurement[]
  ) => {
    if (!arr[index + 1]) {
      return <Text style={styles.value}>-</Text>;
    }
    const prevMeasurement = arr[index + 1].value;
    const difference = value - prevMeasurement;
    const rounded = Number(difference.toFixed(2));

    if (rounded > 0) {
      return (
        <Text style={[styles.value, { color: theme.green }]}>+{rounded}</Text>
      );
    } else if (rounded < 0) {
      return (
        <Text style={[styles.value, { color: theme.orange }]}>{rounded}</Text>
      );
    } else {
      return <Text style={styles.value}>0</Text>;
    }
  };

  const deleteMeasurementHandler = async (
    measurementId: string,
    measurementLabeL: string
  ) => {
    await deleteMeasurement(measurementId);
    removeMeasurement(measurementId, measurementLabeL);
  };

  const filteredMeasurements = getFilteredMeasurements(selectedRange);

  const labels = filteredMeasurements
    .map((m) => formatDateShort(m.created_at))
    .toReversed();
  const data = filteredMeasurements.map((m) => m.value).toReversed();

  const renderMeasurementItem = ({
    item,
    index,
  }: {
    item: Measurement;
    index: number;
  }) => {
    return (
      <SwipeToDelete
        onDelete={() => deleteMeasurementHandler(item.id, item.label)}
      >
        <View style={styles.row}>
          <Text style={styles.date}>
            {formatDate(new Date(item.created_at))}
          </Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Text style={styles.value}>
              {item.value} {item.unit}
            </Text>
            {calculateDifference(item.value, index, filteredMeasurements)}
          </View>
        </View>
      </SwipeToDelete>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <CustomHeader name={measurement.displayName} href="/metrics" />
        <View style={styles.filterContainer}>
          {TIME_PERIOD_BUTTONS.map((btn) => (
            <Pressable
              key={btn.value}
              style={[
                styles.filterButton,
                selectedRange === btn.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRange(btn.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedRange === btn.value && styles.filterButtonTextActive,
                ]}
              >
                {btn.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {filteredMeasurements.length > 0 && (
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data,
                },
              ],
            }}
            width={SCREEN_WIDTH - 50}
            height={220}
            CHART_CONFIG={CHART_CONFIG(theme)}
            bezier
            style={styles.chart}
            fromZero
            yAxisSuffix={measurement.unit}
          />
        )}

        <Pressable
          style={styles.addButton}
          onPress={() => setIsMetricsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Measurement</Text>
        </Pressable>

        <Text style={styles.historyText}>
          {filteredMeasurements.length > 0 ? "HISTORY" : "NO MEASUREMENTS"}
        </Text>
        <FlatList
          data={filteredMeasurements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMeasurementItem}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>

      <AddMetricsModal
        closeModal={() => setIsMetricsModalVisible(false)}
        isVisible={isMetricsModalVisible}
        onPress={addMeasurementHandler}
        label={measurement.displayName}
      />
    </>
  );
}
const makeStyles = (theme: ThemeColors, mode: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: theme.background,
      height: "100%",
    },
    // FILTER BUTTONS
    filterContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginVertical: 10,
      gap: 10,
    },
    filterButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: mode === AppThemeEnum.DARK ? theme.black : theme.gray,
      marginRight: 5,
    },
    filterButtonActive: {
      backgroundColor: theme.blue,
    },
    filterButtonText: {
      color: theme.textColor,
      fontWeight: "bold",
    },
    filterButtonTextActive: {
      color: theme.white,
      fontWeight: "bold",
    },
    // CHART
    chart: {
      marginVertical: 8,
      borderRadius: 8,
    },
    addButton: {
      width: "100%",
      padding: 10,
      backgroundColor: theme.lightBlue,
      borderRadius: 10,
      marginVertical: 10,
    },
    addButtonText: {
      color: theme.blue,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
    },
    historyText: {
      fontSize: 16,
      color: theme.textColor,
      marginVertical: 10,
    },
    listContainer: {
      gap: 10,
    },
    row: {
      height: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    date: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textColor,
    },
    value: {
      fontSize: 16,
      color: theme.textColor,
    },
  });
