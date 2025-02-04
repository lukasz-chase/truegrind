import { AppColors } from "@/constants/colors";
import { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  large?: boolean;
  backgroundColor?: string;
  textColor?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
};
const CustomTextInput = ({
  onChangeText,
  value,
  placeholder,
  large = false,
  backgroundColor = AppColors.gray,
  textColor = "black",
  keyboardType = "default",
  secureTextEntry = false,
}: Props) => {
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#b3b1b1"
      value={value}
      onChangeText={onChangeText}
      multiline={large}
      numberOfLines={large ? 4 : 1}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[
        styles.input,
        {
          borderColor: inputFocus ? "black" : "white",
          height: large ? 120 : 40,
          maxHeight: large ? 120 : 40,
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
