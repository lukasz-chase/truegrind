import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import MemoizedScrollPicker from "./MemoizedScrollPicker";
import { AppColors } from "@/constants/colors";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  screenWidth: number;
  translateX: Animated.SharedValue<number>;
  exerciseTimer: number | null;
  customDuration: number;
  setCustomDuration: React.Dispatch<React.SetStateAction<number>>;
  switchToMainScreen: () => void;
};

const AutoRestTimeSettings = ({
  screenWidth,
  translateX,
  exerciseTimer,
  setCustomDuration,
  customDuration,
  switchToMainScreen,
}: Props) => {
  const [isEnabled, setIsEnabled] = useState(!!exerciseTimer);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const SWIPE_THRESHOLD = screenWidth / 2;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 50) {
        // Translate modal while swiping
        translateX.value = withTiming(
          Math.min(event.translationX, SWIPE_THRESHOLD),
          {
            duration: 0,
          }
        );
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(switchToMainScreen)();
      } else {
        // If swipe doesn't cross threshold, reset to the current screen
        translateX.value = withSpring(-screenWidth, {
          duration: 300,
        });
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={switchToMainScreen}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={AppColors.blue}
            />
          </Pressable>
          <Text style={styles.text}>Auto Rest Timer</Text>
          <View />
        </View>
        <View style={styles.header}>
          <Text style={styles.text}>Enabled</Text>
          <Switch
            trackColor={{ false: "#767577", true: AppColors.blue }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <MemoizedScrollPicker
          customDuration={customDuration}
          setCustomDuration={setCustomDuration}
          visibleItemCount={5}
          disabled={!isEnabled}
        />
      </View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
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
