import { formatTime } from "@/lib/helpers";
import React, { memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import WheelPicker from "@quidone/react-native-wheel-picker";

type Props = {
  customDuration: number;
  setCustomDuration: React.Dispatch<React.SetStateAction<number>>;
  visibleItemCount: number;
  textColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
};

const MemoizedScrollPicker = memo(
  ({
    disabled = false,
    backgroundColor = "white",
    textColor = "white",
    customDuration,
    setCustomDuration,
    visibleItemCount,
  }: Props) => {
    const timeOptions = Array.from({ length: 121 }, (_, i) => ({
      value: i * 5,
      label: formatTime(i * 5),
    }));
    const onValueChange = ({
      item: { value },
    }: {
      item: { value: number };
    }) => {
      setCustomDuration(value);
    };
    return (
      <View style={styles.scrollPicker}>
        <WheelPicker
          readOnly={disabled}
          data={timeOptions}
          value={customDuration}
          onValueChanged={onValueChange}
          visibleItemCount={visibleItemCount}
          itemTextStyle={{
            color: disabled ? "gray" : textColor,
            fontSize: 16,
            fontWeight: "bold",
          }}
          overlayItemStyle={{
            height: 40,
            backgroundColor: disabled ? "transparent" : backgroundColor,
          }}
          onValueChanging={() => {
            if (Platform.OS !== "web") Haptics.selectionAsync();
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  scrollPicker: {
    width: "100%",
  },
});

export default MemoizedScrollPicker;
