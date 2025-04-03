import { useState } from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppColors } from "@/constants/colors";

const CustomDateTimePicker = ({ label, value, onChange }: any) => {
  const [showPicker, setShowPicker] = useState(false);

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
              borderColor: AppColors.gray,
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

const styles = StyleSheet.create({
  timePickerWrapper: {
    alignItems: "center",
    gap: 10,
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default CustomDateTimePicker;
