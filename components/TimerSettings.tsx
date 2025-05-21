import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import MemoizedScrollPicker from "./MemoizedScrollPicker";
import { formatTime } from "@/utils/calendar";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

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
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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
          trackColor={{ false: theme.charcoalGray, true: theme.blue }}
          thumbColor={theme.white}
          ios_backgroundColor={theme.graphiteGray}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <MemoizedScrollPicker
        value={timerValue!}
        setValue={setTimer}
        visibleItemCount={5}
        enabled={isEnabled}
        data={timeOptions}
        textColor={theme.white}
      />
    </>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    text: {
      color: theme.white,
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
  });
export default TimerSettings;
