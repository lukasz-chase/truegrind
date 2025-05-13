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
        <View style={[styles.skeleton, { width: 50 }]} />
        <View style={[styles.skeleton, { width: 150 }]} />
        <View style={[styles.skeleton, { width: 50 }]} />
      </View>
      <View style={{ flexDirection: "column", gap: 10, padding: 10 }}>
        <View style={[styles.skeleton, { width: 150 }]} />
        <View style={[styles.skeleton, { width: 50 }]} />
        <View style={[styles.skeleton, { width: 200 }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    height: 40,
    backgroundColor: AppColors.gray,
  },
});
