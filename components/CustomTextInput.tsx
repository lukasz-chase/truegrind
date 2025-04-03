import { AppColors } from "@/constants/colors";
import { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  size?: "sm" | "md" | "lg";
  backgroundColor?: string;
  textColor?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
};
const CustomTextInput = ({
  onChangeText,
  value,
  placeholder,
  backgroundColor = AppColors.gray,
  textColor = AppColors.black,
  keyboardType = "default",
  secureTextEntry = false,
  size = "sm",
}: Props) => {
  const [inputFocus, setInputFocus] = useState(false);
  const isLarge = size === "lg";
  const returnHeight = () => {
    switch (size) {
      case "sm":
        return 40;
      case "md":
        return 60;
      case "lg":
        return 120;
    }
  };
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={AppColors.darkGray}
      value={value}
      onChangeText={onChangeText}
      multiline={isLarge}
      numberOfLines={isLarge ? 4 : 1}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[
        styles.input,
        {
          borderColor: inputFocus ? AppColors.black : AppColors.white,
          height: returnHeight(),
          maxHeight: returnHeight(),
          backgroundColor,
          color: textColor,
        },
      ]}
      underlineColorAndroid="transparent"
      onFocus={() => setInputFocus(true)}
      onBlur={() => setInputFocus(false)}
    />
  );
};

export default CustomTextInput;
const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
});
