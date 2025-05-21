import { useMemo, useState } from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

const CustomDateTimePicker = ({ label, value, onChange }: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false); // Hide the picker after selection
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.timePickerWrapper}>
      <Text style={styles.timePickerLabel}>{label}</Text>

      {Platform.OS === "android" ? (
        <>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: theme.gray,
              borderRadius: 5,
            }}
          >
            <Text>
              {value.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={value}
              mode="time"
              is24Hour={true}
              minuteInterval={5}
              display="default"
              onChange={onDateChange}
            />
          )}
        </>
      ) : (
        <DateTimePicker
          value={value}
          mode="time"
          minuteInterval={5}
          onChange={onDateChange}
          style={{ marginLeft: -10 }}
        />
      )}
    </View>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    timePickerWrapper: {
      alignItems: "center",
      gap: 10,
    },
    timePickerLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textColor,
    },
  });
export default CustomDateTimePicker;
