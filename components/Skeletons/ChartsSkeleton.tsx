import { ScrollView, StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  return (
    <ScrollView style={parentStyles.container}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonChart} />
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonChart} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  skeletonTitle: {
    width: "40%", // approximate width for a title
    height: 20,
    borderRadius: 4,
    marginTop: 16,
    marginLeft: 16,
    backgroundColor: AppColors.skeleton,
  },
  skeletonChart: {
    width: "90%", // approximate width for chart skeleton
    height: 220,
    borderRadius: 8,
    marginVertical: 8,
    marginLeft: "5%",
    backgroundColor: AppColors.skeleton,
  },
});
