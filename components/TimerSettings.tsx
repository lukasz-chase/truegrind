import { AppColors } from "@/constants/colors";
import { formatTime } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import MemoizedScrollPicker from "./MemoizedScrollPicker";

const timeOptions = Array.from({ length: 121 }, (_, i) => ({
  value: i * 5,
  label: formatTime(i * 5),
}));

const TimerSettings = ({
  timerValue,
  setTimer,
}: {
  timerValue: number | null;
  setTimer: (timerValue: number | null) => void;
}) => {
  const [isEnabled, setIsEnabled] = useState(!!timerValue);

  useEffect(() => {
    setIsEnabled(!!timerValue);
  }, [timerValue]);

  const toggleSwitch = (value: boolean) => {
    setIsEnabled(value);
    if (!value) setTimer(null);
  };
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>Enabled</Text>
        <Switch
          trackColor={{ false: AppColors.charcoalGray, true: AppColors.blue }}
          thumbColor={AppColors.white}
          ios_backgroundColor={AppColors.graphiteGray}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <MemoizedScrollPicker
        value={timerValue!}
        setValue={setTimer}
        visibleItemCount={5}
        disabled={!isEnabled}
        data={timeOptions}
      />
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default TimerSettings;
