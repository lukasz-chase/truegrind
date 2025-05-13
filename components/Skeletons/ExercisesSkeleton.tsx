import { StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
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

const styles = StyleSheet.create({
  skeletonItem: {
    height: 60,
    width: "100%",
    backgroundColor: AppColors.gray,
  },
});
