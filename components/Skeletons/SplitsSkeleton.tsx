import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <SafeAreaView style={parentStyles.container}>
      <View style={parentStyles.newSplitButton}>
        <Text style={[parentStyles.title, { color: theme.white }]}>
          Create your own split
        </Text>
        <AntDesign name="right" size={24} color={theme.white} />
      </View>
      <Text style={parentStyles.title}>Or choose one</Text>
      <View style={{ gap: 10 }}>
        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    cardSkeleton: {
      width: "100%",
      backgroundColor: theme.skeleton,
      height: 100,
      borderRadius: 10,
    },
  });
