import { View, Text, Pressable } from "react-native";
import { barTypes } from "@/constants/keyboard";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import { Image } from "expo-image";
import { BarTypeEnum } from "@/types/exercisesSets";
import { useMemo } from "react";
import KeyboardStyles from "./KeyboardStyles";
import useThemeStore from "@/store/useThemeStore";

type Props = {
  selectedBarType: BarTypeEnum | null;
  setBarType: (barType: BarTypeEnum) => void;
  setKeyboardView: (value: KeyboardView) => void;
};

const BarTypeKeyboard = ({
  selectedBarType,
  setBarType,
  setKeyboardView,
}: Props) => {
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => KeyboardStyles(theme), [theme]);
  const images = {
    "womens_olympic_bar.png": require("@/assets/images/womens_olympic_bar.png"),
    "mens_olympic_bar.png": require("@/assets/images/mens_olympic_bar.png"),
    "ez_curl_bar.png": require("@/assets/images/ez_curl_bar.png"),
    "trap_bar.png": require("@/assets/images/trap_bar.png"),
    "squat_safety_bar.png": require("@/assets/images/squat_safety_bar.png"),
    "triceps_bar.png": require("@/assets/images/triceps_bar.png"),
  };
  const isSelectedBarType = (barTypeName: string) =>
    selectedBarType === barTypeName;
  return (
    <View style={styles.rpeView}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Pressable
          style={[styles.button, { width: 100 }]}
          onPress={() => setKeyboardView(KeyboardViewEnum.DEFAULT)}
        >
          <Text style={styles.buttonText}>Bar Type</Text>
        </Pressable>
      </View>
      <View style={styles.barButtonsWrapper}>
        {barTypes.map((barType) => (
          <Pressable
            key={barType.name}
            style={[
              styles.barButton,
              isSelectedBarType(barType.name) && styles.selectedBarButton,
            ]}
            onPress={() => setBarType(barType.name)}
          >
            <Image
              source={images[barType.image as keyof typeof images]}
              style={styles.barImage}
            />
            <Text
              style={[
                styles.barName,
                isSelectedBarType(barType.name) && styles.selectedBarName,
              ]}
            >
              {barType.name}
            </Text>
            <Text
              style={[
                styles.barName,
                isSelectedBarType(barType.name) && styles.selectedBarName,
              ]}
            >
              {barType.weight}kg
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default BarTypeKeyboard;
