import { AppColors } from "@/constants/colors";
import { formatDateShort } from "@/lib/helpers";
import { WorkoutMetrics } from "@/types/workoutMetrics";
import { Text, StyleSheet, Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

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

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: AppColors.darkBlue,
    },
  };
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
        width={screenWidth - 50}
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
        width={screenWidth - 50}
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
        width={screenWidth - 50}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero
        yAxisSuffix="kg"
      />

      <Text style={styles.chartTitle}>Max Consecutive Reps</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: maxRepsData }],
        }}
        width={screenWidth - 50}
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
    backgroundColor: "#e0e0e0",
  },
  skeletonChart: {
    width: "90%", // approximate width for chart skeleton
    height: 220,
    borderRadius: 8,
    marginVertical: 8,
    marginLeft: "5%",
    backgroundColor: "#e0e0e0",
  },
});
