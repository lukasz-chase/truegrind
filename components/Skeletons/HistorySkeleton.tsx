import { StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";

const SkeletonRow = () => (
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

export default () => {
  return (
    <View style={{ gap: 10 }}>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  );
};

const styles = StyleSheet.create({
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
