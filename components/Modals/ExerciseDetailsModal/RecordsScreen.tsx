import { AppColors } from "@/constants/colors";
import { count1RM } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const RecordsScreen = ({ exerciseId }: { exerciseId: string }) => {
  const [oneRMRecord, setOneRMRecord] = useState<{
    value: number;
    date: string;
  } | null>(null);
  const [weightRecord, setWeightRecord] = useState<{
    value: number;
    date: string;
  } | null>(null);
  const [volumeRecord, setVolumeRecord] = useState<{
    value: number;
    date: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, [exerciseId]);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sets_history")
      .select("reps, weight, created_at")
      .eq("exercise_id", exerciseId)
      .not("is_warmup", "eq", true)
      .not("is_dropset", "eq", true);

    if (error) {
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      setLoading(false);
      return;
    }

    let bestOneRM = 0;
    let bestOneRMDate = "";
    let highestWeight = 0;
    let highestWeightDate = "";
    let maxVolume = 0;
    let maxVolumeDate = "";

    for (const set of data) {
      const { reps, weight, created_at } = set;

      const oneRM = count1RM(weight, reps);
      if (oneRM > bestOneRM) {
        bestOneRM = oneRM;
        bestOneRMDate = created_at;
      }

      if (weight > highestWeight) {
        highestWeight = weight;
        highestWeightDate = created_at;
      }

      const volume = weight * reps;
      if (volume > maxVolume) {
        maxVolume = volume;
        maxVolumeDate = created_at;
      }
    }

    setOneRMRecord({ value: bestOneRM, date: bestOneRMDate });
    setWeightRecord({ value: highestWeight, date: highestWeightDate });
    setVolumeRecord({ value: maxVolume, date: maxVolumeDate });
    setLoading(false);
  };

  const records = [
    { label: "1RM", record: oneRMRecord, isOneRM: true },
    { label: "Highest Weight", record: weightRecord, isOneRM: false },
    { label: "Max Volume", record: volumeRecord, isOneRM: false },
  ];

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
        : records.map(({ label, record, isOneRM }, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{label}</Text>
              {record && record.value !== 0 ? (
                <View style={styles.row}>
                  <Text style={styles.rowText}>
                    {isOneRM ? record.value.toFixed(1) : record.value} kg
                  </Text>
                  <Text style={[styles.rowText, { color: AppColors.black }]}>
                    {new Date(record.date).toLocaleDateString()}
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

const styles = StyleSheet.create({
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
  },
  section: {
    gap: 5,
  },
  sectionTitle: {
    fontSize: 16,
    color: AppColors.blue,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonBox: {
    backgroundColor: AppColors.gray,
    height: 20,
    width: "40%",
    borderRadius: 4,
  },
});

export default RecordsScreen;
