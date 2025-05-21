import { Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bodyPartsToMeasure, corePartsToMeasure } from "@/constants/metrics";
import { ScrollView } from "react-native-gesture-handler";
import AddMetricsModal from "@/components/Modals/AddMetricsModal";
import { useEffect, useMemo, useState } from "react";
import {
  createMeasurement,
  fetchAllUserMeasurements,
} from "@/lib/measurementsService";
import userStore from "@/store/userStore";
import MeasurementList from "@/components/MeasurementList";
import * as Haptics from "expo-haptics";
import useMeasurementsStore from "@/store/useMeasurementsStore";
import { ThemeColors } from "@/types/user";
import useThemeStore from "@/store/useThemeStore";

export default function MetricsScreen() {
  const [isMetricsModalVisible, setIsMetricsModalVisible] = useState(false);
  const [measurement, setMeasurement] = useState({
    label: "",
    displayName: "",
    unit: "",
  });
  const {
    addDisplayedMeasurement,
    setDisplayedMeasurements,
    displayedMeasurements,
  } = useMeasurementsStore();

  const { user } = userStore();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const data = await fetchAllUserMeasurements(user.id);
          setDisplayedMeasurements(data);
        }
      } catch (error) {
        console.error("Error fetching measurements", error);
      }
    };
    if (Object.keys(displayedMeasurements).length === 0) {
      fetchData();
    }
  }, [user, displayedMeasurements]);
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
      addDisplayedMeasurement(data);
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
            measurements={displayedMeasurements}
            onPressPlus={openModalHandler}
          />
          <MeasurementList
            title="Body Parts"
            items={bodyPartsToMeasure}
            measurements={displayedMeasurements}
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: theme.background,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      marginVertical: 10,
      marginHorizontal: "auto",
      color: theme.textColor,
    },
  });
