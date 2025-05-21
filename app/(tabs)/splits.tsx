import SplitCard from "@/components/SplitCard";
import { fetchSplits } from "@/lib/splitsServices";
import useAppStore from "@/store/useAppStore";
import userStore from "@/store/userStore";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import useSplitsStore from "@/store/useSplitsStore";
import ProfileSkeleton from "@/components/Skeletons/ProfileSkeleton";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

export default function SplitsScreen() {
  const [loading, setLoading] = useState(false);

  const { user } = userStore();
  const { refetchData } = useAppStore();
  const { setSplits, splits, removeSplit } = useSplitsStore();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();

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
    if (user && splits.length === 0) {
      getSplits();
    }
  }, [user]);

  if (loading) return <ProfileSkeleton parentStyles={styles} />;
  if (!user) return null;
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => router.push("/newSplit")}
        style={styles.newSplitButton}
      >
        <Text style={[styles.title, { color: theme.white }]}>
          Create your own split
        </Text>
        <AntDesign name="right" size={24} color={theme.white} />
      </Pressable>
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
            removeLocalSplit={removeSplit}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 10,
      flex: 1,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 28,
      textTransform: "uppercase",
      color: theme.textColor,
      paddingVertical: 20,
      fontWeight: "bold",
    },
    listContainer: {
      gap: 10,
    },
    newSplitButton: {
      width: "100%",
      backgroundColor: theme.blue,
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderRadius: 10,
    },
  });
