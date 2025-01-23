import { AppColors } from "@/constants/colors";
import { formatDate, formatDateShort } from "@/lib/helpers";
import {
  createMeasurement,
  deleteMeasurement,
  fetchUserMeasurements,
} from "@/lib/measurementsService";
import userStore from "@/store/userStore";
import { Measurement, MeasurementTimeRange } from "@/types/measurements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import AddMetricsModal from "@/components/Modals/AddMetricsModal";
import { allMetrics, timePeriodButtons } from "@/constants/metrics";
import { LineChart } from "react-native-chart-kit";
import { chartConfig } from "@/constants/chart";
import useMeasurementsStore from "@/store/useMeasurementsStore";
import SwipeToDelete from "@/components/SwipeToDelete";

const screenWidth = Dimensions.get("window").width;

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
  const measurement = allMetrics.find((m) => m.label === id);

  const router = useRouter();

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
    const difference = Math.floor(value - prevMeasurement);

    if (difference > 0) {
      return (
        <Text style={[styles.value, { color: AppColors.green }]}>
          +{difference}
        </Text>
      );
    } else if (difference < 0) {
      return (
        <Text style={[styles.value, { color: AppColors.orange }]}>
          {difference}
        </Text>
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

  const goBackHandler = () => {
    router.push("/metrics");
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
        <View style={styles.header}>
          <Pressable onPress={goBackHandler}>
            <AntDesign name="left" size={24} color="black" />
          </Pressable>
          <Text style={styles.title}>{measurement.displayName}</Text>
          <View style={{ width: 24 }} />
        </View>
        {filteredMeasurements.length > 0 && (
          <>
            <View style={styles.filterContainer}>
              {timePeriodButtons.map((btn) => (
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
                      selectedRange === btn.value &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {btn.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <LineChart
              data={{
                labels,
                datasets: [
                  {
                    data,
                  },
                ],
              }}
              width={screenWidth - 50}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
              yAxisSuffix={measurement.unit}
            />
          </>
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    height: "100%",
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
    backgroundColor: "#EEE",
    marginRight: 5,
  },
  filterButtonActive: {
    backgroundColor: AppColors.blue,
  },
  filterButtonText: {
    color: AppColors.black,
    fontWeight: "bold",
  },
  filterButtonTextActive: {
    color: "white",
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
    backgroundColor: AppColors.lightBlue,
    borderRadius: 10,
    marginVertical: 10,
  },
  addButtonText: {
    color: AppColors.blue,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  historyText: {
    fontSize: 16,
    color: AppColors.darkGray,
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
    backgroundColor: "white",
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
  },
});
