import { View, StyleSheet } from "react-native";
import { ThemeColors } from "@/types/user";

const CustomHandle = ({ theme }: { theme: ThemeColors }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.handle, { backgroundColor: theme.textColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 2,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
});

export default CustomHandle;
