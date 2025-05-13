import { FlatList, StyleSheet, Text, View } from "react-native";
import { ExerciseSet } from "@/types/exercisesSets";
import { AppColors } from "@/constants/colors";
import { WorkoutMetrics } from "@/types/workoutMetrics";
import { barTypes } from "@/constants/keyboard";
import { formatDate } from "@/utils/calendar";
import HistorySkeleton from "@/components/Skeletons/HistorySkeleton";

const HistoryScreen = ({
  loading,
  history,
}: {
  loading: boolean;
  history: WorkoutMetrics[];
}) => {
  if (loading) return <HistorySkeleton />;
  if (!history || history.length === 0) {
    return (
      <View style={{ gap: 10 }}>
        <Text style={[styles.title]}>No history found</Text>
      </View>
    );
  }
  const getBarType = (barType: string | null) => {
    if (!barType) return "";
    const bar = barTypes.find((type) => type.name === barType);
    return ` +${bar?.weight}kg`;
  };
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.workoutName}</Text>
      <Text style={styles.subTitle}>
        {formatDate(new Date(item.workoutDate))}
      </Text>
      <View style={styles.row}>
        <Text style={styles.title}>Sets Performed</Text>
        <Text style={styles.title}>1RM</Text>
      </View>
      {item.exercisesMetrics.map((historyItem: any) =>
        historyItem.setsMetrics.map(
          (set: ExerciseSet & { oneRepMax: number }) => (
            <View key={set.id} style={styles.row}>
              <View style={{ flexDirection: "row", gap: 5 }}>
                {set.is_warmup && (
                  <Text style={[styles.subTitle, { color: AppColors.orange }]}>
                    W
                  </Text>
                )}
                {set.is_dropset && (
                  <Text style={[styles.subTitle, { color: AppColors.purple }]}>
                    D
                  </Text>
                )}
                <Text style={[styles.subTitle, { marginRight: 5 }]}>
                  {set.order}
                </Text>
                <Text style={styles.subTitle}>
                  {set.weight}kg{getBarType(set.bar_type)}
                </Text>
                <Text style={styles.subTitle}>x</Text>
                <Text style={styles.subTitle}>{set.reps}</Text>
                {set.rpe && <Text style={styles.subTitle}>@{set.rpe}</Text>}
                {set.partials && (
                  <Text style={styles.subTitle}>+{set.partials}</Text>
                )}
              </View>
              {set.weight && set.reps ? (
                <Text style={styles.subTitle}>{set.oneRepMax}</Text>
              ) : (
                <Text style={styles.subTitle}>N/A</Text>
              )}
            </View>
          )
        )
      )}
    </View>
  );

  return (
    <FlatList
      data={history}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      style={styles.wrapper}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    gap: 10,
  },
  itemContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: AppColors.gray,
    width: "100%",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    color: AppColors.darkGray,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default HistoryScreen;
