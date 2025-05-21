import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo, useState } from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  size?: "sm" | "md" | "lg";
  backgroundColor?: string | null;
  textColor?: string | null;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
};
const CustomTextInput = ({
  onChangeText,
  value,
  placeholder,
  backgroundColor = null,
  textColor = null,
  keyboardType = "default",
  secureTextEntry = false,
  size = "sm",
}: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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
      placeholderTextColor={theme.textColor}
      value={value}
      onChangeText={onChangeText}
      multiline={isLarge}
      numberOfLines={isLarge ? 4 : 1}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[
        styles.input,
        {
          borderColor: inputFocus ? theme.black : theme.white,
          height: returnHeight(),
          maxHeight: returnHeight(),
          backgroundColor: backgroundColor ?? theme.gray,
          color: textColor ?? theme.textColor,
        },
      ]}
      underlineColorAndroid="transparent"
      onFocus={() => setInputFocus(true)}
      onBlur={() => setInputFocus(false)}
    />
  );
};

export default CustomTextInput;
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    input: {
      borderRadius: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      width: "100%",
    },
  });
