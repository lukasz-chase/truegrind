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
      <Text style={styles.title}>Choose your split</Text>
      <FlatList
        data={splits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SplitCard split={item} userId={user!.id} refetchData={refetchData} />
        )}
        contentContainerStyle={styles.listContainer}
      />
      <View style={{ marginTop: 10 }}>
        <SplitCard
          userId={user!.id}
          split={{ id: "new", name: "Create New Split", user_id: "" }}
          refetchData={refetchData}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 32,
    color: AppColors.black,
    paddingVertical: 20,
    fontWeight: "bold",
  },
  listContainer: {
    gap: 10,
  },
  cardSkeleton: {
    width: "100%",
    backgroundColor: "#E0E0E0",
    height: 60,
    borderRadius: 10,
  },
});
