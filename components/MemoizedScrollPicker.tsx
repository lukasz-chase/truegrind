import { memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/colors";
import { Picker } from "@react-native-picker/picker";

type Props = {
  value: number | string;
  setValue: any;
  visibleItemCount: number;
  textColor?: string;
  enabled?: boolean;
  data: { value: number; label: string }[];
};

const MemoizedScrollPicker = memo(
  ({
    enabled = true,
    textColor = AppColors.black,
    value,
    setValue,
    visibleItemCount,
    data,
  }: Props) => {
    return (
      <View
        style={[
          styles.scrollPicker,
          Platform.OS === "android" && styles.androidPicker,
          !enabled && styles.disabled,
        ]}
        pointerEvents={enabled ? "auto" : "none"}
      >
        <Picker
          enabled={enabled}
          selectedValue={value}
          onValueChange={setValue}
          style={styles.picker}
          mode="dropdown"
          itemStyle={{ height: 40 * visibleItemCount }}
          numberOfLines={1}
        >
          {data.map((dataItem) => (
            <Picker.Item
              color={textColor}
              label={dataItem.label}
              value={dataItem.value}
              key={dataItem.value}
            />
          ))}
        </Picker>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  scrollPicker: {
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 10,
  },
  androidPicker: {
    elevation: 2,
  },
  picker: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default MemoizedScrollPicker;
