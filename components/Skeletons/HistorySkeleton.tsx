import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const SkeletonRow = () => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.itemContainer}>
      <View style={[styles.skeletonBox, { width: "30%" }]} />
      <View style={[styles.skeletonBox, { width: "50%" }]} />
      <View style={styles.row}>
        <View style={[styles.skeletonBox, { width: "40%" }]} />
        <View style={[styles.skeletonBox, { width: "20%" }]} />
      </View>
      <View style={styles.row}>
        <View style={[styles.skeletonBox, { width: "50%" }]} />
        <View style={[styles.skeletonBox, { width: "20%" }]} />
      </View>
    </View>
  );
};

export default () => {
  return (
    <View style={{ gap: 10 }}>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    itemContainer: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.darkGray,
      width: "100%",
      gap: 10,
      overflow: "hidden",
    },
    skeletonBox: {
      height: 15,
      backgroundColor: theme.gray,
      borderRadius: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
    },
  });
