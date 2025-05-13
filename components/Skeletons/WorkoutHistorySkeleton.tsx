import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  return (
    <SafeAreaView style={parentStyles.container}>
      <View style={parentStyles.header}>
        <View style={[styles.skeleton, { width: 40 }]} />
        <View style={[styles.skeleton, { width: 150 }]} />
        <View style={{ width: 40 }} />
      </View>
      <View style={[styles.skeleton, { height: 300, width: "100%" }]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    height: 30,
    backgroundColor: AppColors.gray,
  },
});
