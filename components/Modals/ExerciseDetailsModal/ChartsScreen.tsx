import { chartConfig } from "@/constants/chart";
import { AppColors } from "@/constants/colors";
import { SCREEN_WIDTH } from "@/constants/device";
import { WorkoutMetrics } from "@/types/workoutMetrics";
import { formatDateShort } from "@/utils/calendar";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const ChartsScreen = ({
  data,
  loading,
}: {
  data: WorkoutMetrics[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonChart} />
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonChart} />
      </ScrollView>
    );
  }
  if (!data || data.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <Text
          style={[styles.chartTitle, { textAlign: "center", fontSize: 18 }]}
        >
          No workout data available.
        </Text>
      </ScrollView>
    );
  }
  const reversedData = data.toReversed();

  const labels = reversedData.map((h) => formatDateShort(h.workoutDate));

  const oneRMData = reversedData.map((h) =>
    h.highestOneRepMax ? h.highestOneRepMax.value : 0
  );

  const totalVolumeData = reversedData.map((h) =>
    h.highestVolumeSet ? h.highestVolumeSet.totalVolume : 0
  );
  const heaviestWeightData = reversedData.map((h) =>
    h.highestWeightSet ? h.highestWeightSet.weight : 0
  );

  const maxRepsData = reversedData.map((h) => h.maxConsecutiveReps || 0);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chartTitle}>1RM Progression</Text>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: oneRMData,
            },
          ],
        }}
        width={SCREEN_WIDTH - 50}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero
      />

      <Text style={styles.chartTitle}>Total Volume (Highest Volume Set)</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: totalVolumeData }],
        }}
        width={SCREEN_WIDTH - 50}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero
      />

      <Text style={styles.chartTitle}>Heaviest Weight per Workout</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: heaviestWeightData }],
        }}
        width={SCREEN_WIDTH - 65}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix="kg"
      />

      <Text style={styles.chartTitle}>Max Consecutive Reps</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: maxRepsData }],
        }}
        width={SCREEN_WIDTH - 50}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero
      />
    </ScrollView>
  );
};

export default ChartsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  chartContainer: {
    width: "100%",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  chart: {
    flex: 1,
    marginVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  skeletonTitle: {
    width: "40%", // approximate width for a title
    height: 20,
    borderRadius: 4,
    marginTop: 16,
    marginLeft: 16,
    backgroundColor: AppColors.skeleton,
  },
  skeletonChart: {
    width: "90%", // approximate width for chart skeleton
    height: 220,
    borderRadius: 8,
    marginVertical: 8,
    marginLeft: "5%",
    backgroundColor: AppColors.skeleton,
  },
});
