import { FlatList, StyleSheet, Text, View } from "react-native";
import { ExerciseSet } from "@/types/exercisesSets";
import { formatDate } from "@/lib/helpers";
import { AppColors } from "@/constants/colors";
import { WorkoutMetrics } from "@/types/workoutMetrics";

const HistoryScreen = ({
  loading,
  history,
}: {
  loading: boolean;
  history: WorkoutMetrics[];
}) => {
  if (loading)
    return (
      <View style={{ gap: 10 }}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </View>
    );
  if (!history || history.length === 0) {
    return (
      <View style={{ gap: 10 }}>
        <Text style={[styles.title]}>No history found</Text>
      </View>
    );
  }
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
                <Text style={styles.subTitle}>{set.weight}kg</Text>
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

const Skeleton = () => (
  <View style={skeletonStyles.itemContainer}>
    <View style={[skeletonStyles.skeletonBox, { width: "30%" }]} />
    <View style={[skeletonStyles.skeletonBox, { width: "50%" }]} />
    <View style={skeletonStyles.row}>
      <View style={[skeletonStyles.skeletonBox, { width: "40%" }]} />
      <View style={[skeletonStyles.skeletonBox, { width: "20%" }]} />
    </View>
    <View style={skeletonStyles.row}>
      <View style={[skeletonStyles.skeletonBox, { width: "50%" }]} />
      <View style={[skeletonStyles.skeletonBox, { width: "20%" }]} />
    </View>
  </View>
);
const skeletonStyles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: AppColors.darkGray,
    width: "100%",
    gap: 10,
    overflow: "hidden",
  },
  skeletonBox: {
    height: 15,
    backgroundColor: AppColors.gray,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});
export default HistoryScreen;
