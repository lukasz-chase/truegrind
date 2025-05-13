import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  return (
    <SafeAreaView style={parentStyles.container}>
      <Text style={parentStyles.title}>Choose your split</Text>
      <View style={{ gap: 10 }}>
        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
        <View style={styles.cardSkeleton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardSkeleton: {
    width: "100%",
    backgroundColor: AppColors.skeleton,
    height: 60,
    borderRadius: 10,
  },
});
