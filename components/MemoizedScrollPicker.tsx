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

const MemoizedScrollPicker = memo((props: Props) => {
  const {
    enabled = true,
    textColor,
    value,
    setValue,
    visibleItemCount,
    data,
  } = props;
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const isAndroid = Platform.OS === "android";

  return (
    <View
      style={[
        styles.scrollPicker,
        isAndroid && styles.androidPicker,
        !enabled && styles.disabled,
      ]}
      pointerEvents={enabled ? "auto" : "none"}
    >
      <Picker
        enabled={enabled}
        selectedValue={value}
        onValueChange={setValue}
        style={styles.picker}
        mode={isAndroid ? "dropdown" : "dialog"}
        itemStyle={!isAndroid ? styles.pickerItem : undefined}
        numberOfLines={1}
      >
        {data.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
            color={!isAndroid ? textColor ?? theme.textColor : undefined}
          />
        ))}
      </Picker>
    </View>
  );
});

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
