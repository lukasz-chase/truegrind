import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import MemoizedScrollPicker from "./MemoizedScrollPicker";
import { AppColors } from "@/constants/colors";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { formatTime } from "@/lib/helpers";
type Props = {
  screenWidth: number;
  switchToMainScreen: () => void;
};

const AutoRestTimeSettings = ({ screenWidth, switchToMainScreen }: Props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [customDuration, setCustomDuration] = useState(0);
  const timeOptions = Array.from({ length: 121 }, (_, i) => ({
    value: i,
    label: formatTime(i),
  }));
  console.log("rerender");
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={switchToMainScreen}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
        </Pressable>
        <Text style={styles.text}>Auto Rest Timer</Text>
        <View />
      </View>
      <View style={styles.header}>
        <Text style={styles.text}>Enabled</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <WheelPicker
        data={timeOptions}
        value={customDuration}
        onValueChanged={({ item: { value } }) => setCustomDuration(value)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  header: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default AutoRestTimeSettings;
