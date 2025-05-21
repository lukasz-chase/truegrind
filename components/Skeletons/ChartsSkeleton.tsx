import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <ScrollView style={parentStyles.container}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonChart} />
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonChart} />
    </ScrollView>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    skeletonTitle: {
      width: "40%", // approximate width for a title
      height: 20,
      borderRadius: 4,
      marginTop: 16,
      marginLeft: 16,
      backgroundColor: theme.skeleton,
    },
    skeletonChart: {
      width: "90%", // approximate width for chart skeleton
      height: 220,
      borderRadius: 8,
      marginVertical: 8,
      marginLeft: "5%",
      backgroundColor: theme.skeleton,
    },
  });
