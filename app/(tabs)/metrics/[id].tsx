import { AppColors } from "@/constants/colors";
import { formatDate, formatDateShort } from "@/lib/helpers";
import {
  createMeasurement,
  fetchUserMeasurements,
} from "@/lib/measurementsService";
import userStore from "@/store/userStore";
import { Measurement } from "@/types/measurements";
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
import { bodyPartsToMeasure, corePartsToMeasure } from "@/constants/metrics";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function MetricsDetails() {
  const [isMetricsModalVisible, setIsMetricsModalVisible] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const { id } = useLocalSearchParams();
  const { user } = userStore();

  const measurement = [...corePartsToMeasure, ...bodyPartsToMeasure].find(
    (m) => m.label === id
  );

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
      const updatedMeasurements = [data, ...measurements];
      setMeasurements(updatedMeasurements);
    }
  };

  const renderMeasurementItem = ({ item }: { item: Measurement }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.date}>{formatDate(new Date(item.created_at))}</Text>
        <Text style={styles.value}>
          {item.value} {item.unit}
        </Text>
      </View>
    );
  };

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

  const labels = measurements.map((m) => formatDateShort(m.created_at));

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push("/metrics")}>
            <AntDesign name="left" size={24} color="black" />
          </Pressable>
          <Text style={styles.title}>{measurement.displayName}</Text>
          <Text>Edit</Text>
        </View>
        {/* <LineChart
          data={{
            labels,
            datasets: [
              {
                data: measurements.map((m) => m.value),
              },
            ],
          }}
          width={screenWidth - 50}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
          yAxisLabel={measurement.unit}
        /> */}
        <Pressable
          style={styles.addButton}
          onPress={() => setIsMetricsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Measurement</Text>
        </Pressable>
        <Text style={styles.historyText}>HISTORY</Text>
        <FlatList
          data={measurements}
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
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
  },
  historyText: {
    fontSize: 16,
    color: AppColors.darkGray,
    marginVertical: 10,
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
});
