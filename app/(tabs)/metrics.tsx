import { Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bodyPartsToMeasure, corePartsToMeasure } from "@/constants/metrics";
import { ScrollView } from "react-native-gesture-handler";
import AddMetricsModal from "@/components/Modals/AddMetricsModal";
import { useEffect, useState } from "react";
import {
  createMeasurement,
  fetchAllUserMeasurements,
} from "@/lib/measurementsService";
import userStore from "@/store/userStore";
import MeasurementList from "@/components/MeasurementList";
import * as Haptics from "expo-haptics";

export default function MetricsScreen() {
  const [isMetricsModalVisible, setIsMetricsModalVisible] = useState(false);
  const [measurement, setMeasurement] = useState({
    label: "",
    displayName: "",
    unit: "",
  });
  const [measurements, setMeasurements] = useState<{
    [key: string]: { value: number; unit: string };
  }>({});

  const { user } = userStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const data = await fetchAllUserMeasurements(user.id);
          setMeasurements(data);
        }
      } catch (error) {
        console.error("Error fetching measurements", error);
      }
    };

    fetchData();
  }, [user]);
  const openModalHandler = ({
    label,
    displayName,
    unit,
  }: {
    label: string;
    displayName: string;
    unit: string;
  }) => {
    setIsMetricsModalVisible(true);
    setMeasurement({ label, displayName, unit });
  };
  const addMeasurementHandler = async (value: number) => {
    const data = await createMeasurement({
      label: measurement.label,
      unit: measurement.unit,
      value,
      display_name: measurement.displayName,
      user_id: user?.id!,
    });

    if (data) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setMeasurements((prev) => ({
        ...prev,
        [data.label]: {
          unit: data.unit,
          value: data.value,
        },
      }));
    }
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Measurements</Text>
        <ScrollView>
          <MeasurementList
            title="Core"
            items={corePartsToMeasure}
            measurements={measurements}
            onPressPlus={openModalHandler}
          />
          <MeasurementList
            title="Body Parts"
            items={bodyPartsToMeasure}
            measurements={measurements}
            onPressPlus={openModalHandler}
          />
        </ScrollView>
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
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: "auto",
  },
});
