import { AppColors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
export default function MetricsScreen() {
  return (
    <View>
      <Text>Metrics screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
