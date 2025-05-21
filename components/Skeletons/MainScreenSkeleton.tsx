import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <SafeAreaView style={parentStyles.safeArea}>
      <View style={parentStyles.container}>
        {/* Title Placeholder */}
        <View style={styles.skeletonTitle} />
        {/* Buttons */}
        <View style={styles.skeletonButton} />
        <View style={styles.skeletonButton} />

        {/* Template Header Placeholder */}
        <View style={parentStyles.templateHeader}>
          <View style={styles.skeletonSubtitle} />
          <View style={styles.skeletonTemplateBtn} />
        </View>
        {/* Skeleton cards for workouts */}
        <View style={parentStyles.workouts}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    skeletonTitle: {
      height: 30,
      width: "50%",
      backgroundColor: theme.skeleton,
      borderRadius: 5,
      marginVertical: 10,
    },
    skeletonButton: {
      height: 40,
      backgroundColor: theme.skeleton,
      borderRadius: 5,
      marginVertical: 10,
    },
    skeletonSubtitle: {
      width: "30%",
      height: 24,
      backgroundColor: theme.skeleton,
      borderRadius: 5,
    },
    skeletonTemplateBtn: {
      width: 100,
      height: 30,
      backgroundColor: theme.skeleton,
      borderRadius: 5,
    },
    skeletonCard: {
      width: "47%",
      height: 100,
      backgroundColor: theme.skeleton,
      borderRadius: 10,
      marginBottom: 10,
    },
  });
