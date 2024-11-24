import { AppColors } from "@/constants/colors";
import { formatTime } from "@/lib/helpers";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import * as Haptics from "expo-haptics";

type Props = {
  customDuration: number;
  setCustomDuration: React.Dispatch<React.SetStateAction<number>>;
  circularProgressSize: number;
};

const MemoizedScrollPicker = memo(
  ({ customDuration, setCustomDuration, circularProgressSize }: Props) => {
    const timeOptions = Array.from({ length: 121 }, (_, i) => i * 5);
    const itemHeight = 50;
    const visibleItems = 5;
    const onValueChange = (_: any, selectedIndex: number) => {
      const selectedValue = timeOptions[selectedIndex];
      setCustomDuration(selectedValue);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };
    return (
      <View style={[styles.scrollPicker, { width: circularProgressSize }]}>
        <ScrollPicker
          dataSource={timeOptions.map((v) => formatTime(v))}
          selectedIndex={timeOptions.indexOf(customDuration)}
          onValueChange={onValueChange}
          wrapperHeight={circularProgressSize - itemHeight / visibleItems}
          wrapperBackground="#FFFFFF"
          itemHeight={itemHeight}
          highlightColor={AppColors.gray}
          highlightBorderWidth={2}
          itemTextStyle={{
            fontSize: 20,
            color: AppColors.gray,
          }}
          activeItemTextStyle={{
            fontSize: 22,
            fontWeight: "bold",
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  scrollPicker: {
    flex: 1,
    backgroundColor: "red",
  },
});

export default MemoizedScrollPicker;
