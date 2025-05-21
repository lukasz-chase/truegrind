import { memo, useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

type Props = {
  value: number | string;
  setValue: any;
  visibleItemCount: number;
  textColor?: string | null;
  enabled?: boolean;
  data: { value: number; label: string }[];
};

const MemoizedScrollPicker = memo(
  ({
    enabled = true,
    textColor = null,
    value,
    setValue,
    visibleItemCount,
    data,
  }: Props) => {
    const { theme } = useThemeStore((state) => state);

    const styles = useMemo(() => makeStyles(theme), [theme]);
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
              color={textColor ?? theme.textColor}
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
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
