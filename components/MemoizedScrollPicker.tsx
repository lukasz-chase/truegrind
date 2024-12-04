import React, { memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import WheelPicker from "@quidone/react-native-wheel-picker";

type Props = {
  value: number;
  setValue: any;
  visibleItemCount: number;
  textColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
  data: { value: number; label: string }[];
};

const MemoizedScrollPicker = memo(
  ({
    disabled = false,
    backgroundColor = "white",
    textColor = "white",
    value,
    setValue,
    visibleItemCount,
    data,
  }: Props) => {
    const onValueChange = ({
      item: { value },
    }: {
      item: { value: number };
    }) => {
      setValue(value);
      if (Platform.OS !== "web") Haptics.selectionAsync();
    };
    return (
      <View style={styles.scrollPicker}>
        <WheelPicker
          readOnly={disabled}
          data={data}
          value={value}
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
          onValueChanging={onValueChange}
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
