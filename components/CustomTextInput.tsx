import { AppColors } from "@/constants/colors";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  large?: boolean;
  backgroundColor?: string;
  textColor?: string;
};
const CustomTextInput = ({
  onChangeText,
  value,
  placeholder,
  large,
  backgroundColor = AppColors.gray,
  textColor = "black",
}: Props) => {
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#b3b1b1"
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.input,
        {
          borderColor: inputFocus ? "black" : "white",
          height: large ? 120 : 40,
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
    flex: 1,
  },
});
