import React, { memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import WheelPicker, {
  PickerItem,
  ValueChangedEvent,
} from "@quidone/react-native-wheel-picker";
import { AppColors } from "@/constants/colors";

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
    backgroundColor = AppColors.white,
    textColor = AppColors.white,
    value,
    setValue,
    visibleItemCount,
    data,
  }: Props) => {
    const onValueChanged = ({
      item: { value: val },
    }: ValueChangedEvent<PickerItem<number>>) => {
      setValue(val);
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };
    const onValueChanging = () => {
      if (Platform.OS !== "web") Haptics.selectionAsync();
    };

    return (
      <View style={[styles.scrollPicker, { height: 40 * visibleItemCount }]}>
        <WheelPicker
          readOnly={disabled}
          data={data}
          value={value}
          onValueChanged={onValueChanged}
          onValueChanging={onValueChanging}
          visibleItemCount={visibleItemCount}
          itemTextStyle={{
            color: disabled ? AppColors.gray : textColor,
            fontSize: 16,
            fontWeight: "bold",
          }}
          overlayItemStyle={{
            height: 40,
            backgroundColor: disabled ? "transparent" : backgroundColor,
          }}
          itemHeight={40}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  scrollPicker: {
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default MemoizedScrollPicker;
