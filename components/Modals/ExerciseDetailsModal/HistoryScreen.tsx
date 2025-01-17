import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ExerciseSet } from "@/types/exercisesSets";
import { count1RM, formatDate } from "@/lib/helpers";
import { AppColors } from "@/constants/colors";

const HistoryScreen = ({ exerciseId }: { exerciseId: string }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const fetchHistory = async (page: number) => {
    if (loading || !hasMore) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("workout_history")
      .select(
        "name, created_at, exercises_history!inner(id, sets_history!inner(*))"
      )
      .eq("exercises_history.sets_history.exercise_id", exerciseId)
      .order("created_at", { ascending: false })
      .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);

    if (error) {
      setLoading(false);
      return;
    }

    if (data) {
      setHistory((prev) => [...prev, ...data]);
      setHasMore(data.length === itemsPerPage);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ gap: 10 }}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subTitle}>
        {formatDate(new Date(item.created_at))}
      </Text>
      <View style={styles.row}>
        <Text style={styles.title}>Sets Performed</Text>
        <Text style={styles.title}>1RM</Text>
      </View>
      {item.exercises_history.map((historyItem: any) =>
        historyItem.sets_history.map((set: ExerciseSet) => (
          <View key={set.id} style={styles.row}>
            <View style={{ flexDirection: "row", gap: 5 }}>
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
              <Text style={styles.subTitle}>
                {count1RM(set.weight, set.reps).toFixed(1)}
              </Text>
            ) : (
              <Text style={styles.subTitle}>N/A</Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  return (
    <FlatList
      data={history}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
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
