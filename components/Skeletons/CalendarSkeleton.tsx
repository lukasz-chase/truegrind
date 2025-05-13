import { StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  return (
    <View style={[parentStyles.legendsContainer, parentStyles.legendsWrapper]}>
      <View style={styles.legendSkeleton} />
      <View style={styles.legendSkeleton} />
      <View style={styles.legendSkeleton} />
    </View>
  );
};

const styles = StyleSheet.create({
  legendSkeleton: {
    height: 40,
    width: 50,
    backgroundColor: AppColors.gray,
    borderRadius: 10,
  },
});
