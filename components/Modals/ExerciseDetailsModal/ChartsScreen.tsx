import ChartsSkeleton from "@/components/Skeletons/ChartsSkeleton";
import { CHART_CONFIG } from "@/constants/chart";
import { SCREEN_WIDTH } from "@/constants/device";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { WorkoutMetrics } from "@/types/workoutMetrics";
import { formatDateShort } from "@/utils/calendar";
import { useMemo } from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const ChartsScreen = ({
  data,
  loading,
}: {
  data: WorkoutMetrics[];
  loading: boolean;
}) => {
  const { theme } = useThemeStore((state) => state);
  const minChartWidth = SCREEN_WIDTH - 50;
  const maxVisibleLabels = 6;
  const minPointSpacing = 64;

  const styles = useMemo(() => makeStyles(theme), [theme]);
  if (loading) {
    return <ChartsSkeleton parentStyles={styles} />;
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
  const labelStep = Math.max(1, Math.ceil(labels.length / maxVisibleLabels));
  const chartLabels = labels.map((label, index) =>
    index % labelStep === 0 || index === labels.length - 1 ? label : "",
  );
  const chartWidth = Math.max(minChartWidth, labels.length * minPointSpacing);

  const oneRMData = reversedData.map((h) =>
    h.highestOneRepMax ? h.highestOneRepMax.value : 0,
  );

  const totalVolumeData = reversedData.map((h) =>
    h.highestVolumeSet ? h.highestVolumeSet.totalVolume : 0,
  );
  const heaviestWeightData = reversedData.map((h) =>
    h.highestWeightSet ? h.highestWeightSet.weight : 0,
  );

  const maxRepsData = reversedData.map((h) => h.maxConsecutiveReps || 0);

  const renderChart = (
    title: string,
    chartData: number[],
    options?: { fromZero?: boolean; yAxisSuffix?: string },
  ) => (
    <View style={styles.chartSection}>
      <Text style={styles.chartTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScrollContent}
      >
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [{ data: chartData }],
          }}
          width={chartWidth}
          height={220}
          chartConfig={CHART_CONFIG(theme)}
          bezier
          style={styles.chart}
          fromZero={options?.fromZero}
          yAxisSuffix={options?.yAxisSuffix}
        />
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderChart("1RM Progression", oneRMData, { fromZero: true })}
      {renderChart("Total Volume (Highest Volume Set)", totalVolumeData, {
        fromZero: true,
      })}
      {renderChart("Heaviest Weight per Workout", heaviestWeightData, {
        yAxisSuffix: "kg",
      })}
      {renderChart("Max Consecutive Reps", maxRepsData, { fromZero: true })}
    </ScrollView>
  );
};

export default ChartsScreen;

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
    },
    chartContainer: {
      width: "100%",
    },
    chartSection: {
      marginBottom: 4,
    },
    chartScrollContent: {
      paddingRight: 16,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 8,
      color: theme.textColor,
    },
    chart: {
      marginVertical: 8,
      borderRadius: 8,
    },
  });
