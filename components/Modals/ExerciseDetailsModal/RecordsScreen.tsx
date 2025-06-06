import useThemeStore from "@/store/useThemeStore";
import { AppThemeEnum, ThemeColors } from "@/types/user";
import {
  OneRMRecord,
  VolumeRecord,
  WeightRecord,
} from "@/types/workoutMetrics";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  oneRMRecord: OneRMRecord | null;
  weightRecord: WeightRecord | null;
  volumeRecord: VolumeRecord | null;
  loading: boolean;
};

const RecordsScreen = ({
  oneRMRecord,
  weightRecord,
  volumeRecord,
  loading,
}: Props) => {
  const records = [
    {
      label: "1RM",
      record: oneRMRecord?.value,
      isMaxVolume: false,
      date: oneRMRecord?.date,
    },
    {
      label: "Highest Weight",
      record: weightRecord?.weight,
      isMaxVolume: false,
      date: weightRecord?.date,
    },
    {
      label: "Max Volume",
      record: volumeRecord?.totalVolume,
      isMaxVolume: true,
      date: volumeRecord?.date,
    },
  ];

  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.wrapper}>
      <Text style={styles.title}>Personal Records</Text>
      {loading
        ? records.map(({ label }, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{label}</Text>
              <View style={styles.skeletonRow}>
                <View style={styles.skeletonBox} />
                <View style={styles.skeletonBox} />
              </View>
            </View>
          ))
        : records.map(({ label, record, isMaxVolume, date }, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{label}</Text>
              {record && record !== 0 ? (
                <View style={styles.row}>
                  <Text style={styles.rowText}>
                    {record} kg
                    {isMaxVolume &&
                      ` (${volumeRecord?.weight}kg x ${volumeRecord?.reps})`}
                  </Text>
                  <Text style={styles.rowText}>
                    {new Date(date!).toLocaleDateString()}
                  </Text>
                </View>
              ) : (
                <Text style={styles.rowText}>N/A</Text>
              )}
            </View>
          ))}
    </ScrollView>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },
    wrapper: {
      width: "100%",
    },
    title: {
      fontWeight: "bold",
      fontSize: 16,
      textTransform: "uppercase",
      color: theme.textColor,
    },
    section: {
      gap: 5,
    },
    sectionTitle: {
      fontSize: 16,
      color: theme.blue,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rowText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textColor,
    },
    skeletonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    skeletonBox: {
      backgroundColor: theme.gray,
      height: 20,
      width: "40%",
      borderRadius: 4,
    },
  });

export default RecordsScreen;
