import NewSplit from "@/components/NewSplit";
import SplitCard from "@/components/SplitCard";
import { AppColors } from "@/constants/colors";
import { fetchSplits } from "@/lib/splitsServices";
import useAppStore from "@/store/useAppStore";
import userStore from "@/store/userStore";
import { Split } from "@/types/split";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplitsScreen() {
  const [splits, setSplits] = useState<Split[]>();
  const [loading, setLoading] = useState(false);

  const { user } = userStore();
  const { refetchData } = useAppStore();

  useEffect(() => {
    const getSplits = async () => {
      setLoading(true);
      try {
        const data = await fetchSplits(user!.id);
        if (data) {
          setSplits(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      getSplits();
    }
  }, [user]);

  const removeLocalSplit = (splitId: string) => {
    const filteredSplits = splits?.filter((split) => split.id !== splitId);
    setSplits(filteredSplits);
  };

  if (loading)
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Choose your split</Text>
        <View style={{ gap: 10 }}>
          <View style={styles.cardSkeleton} />
          <View style={styles.cardSkeleton} />
          <View style={styles.cardSkeleton} />
          <View style={styles.cardSkeleton} />
        </View>
      </SafeAreaView>
    );
  if (!user) return null;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your own split</Text>
      <NewSplit userId={user.id} refetchData={refetchData} />
      <Text style={styles.title}>Or choose one</Text>
      <FlatList
        data={splits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SplitCard
            split={item}
            userId={user!.id}
            refetchData={refetchData}
            isActiveSplit={item.id === user.active_split_id}
            removeLocalSplit={removeLocalSplit}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    textTransform: "uppercase",
    color: AppColors.black,
    paddingVertical: 20,
    fontWeight: "bold",
  },
  listContainer: {
    gap: 10,
    height: "100%",
  },
  cardSkeleton: {
    width: "100%",
    backgroundColor: "#E0E0E0",
    height: 60,
    borderRadius: 10,
  },
});
