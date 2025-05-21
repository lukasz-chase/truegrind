import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={parentStyles.container}>
      <View style={[styles.skeletonItem, { height: 40 }]} />
      <View style={parentStyles.pickerContainer}>
        <View style={[styles.skeletonItem, { width: "48%", height: 30 }]} />
        <View style={[styles.skeletonItem, { width: "48%", height: 30 }]} />
      </View>
      <View style={{ gap: 10, marginTop: 10 }}>
        <View style={styles.skeletonItem} />
        <View style={styles.skeletonItem} />
        <View style={styles.skeletonItem} />
        <View style={styles.skeletonItem} />
        <View style={styles.skeletonItem} />
        <View style={styles.skeletonItem} />
        <View style={styles.skeletonItem} />
      </View>
    </View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    skeletonItem: {
      height: 60,
      width: "100%",
      backgroundColor: theme.gray,
    },
  });
