import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import DefaultKeyboard from "./DefaultKeyboard";
import RPEKeyboard from "./RPEKeyboard";
import PartialsKeyboard from "./PartialsKeyboard";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import { StyleSheet } from "react-native";
import { KEYBOARD_HEIGHT } from "@/constants/keyboard";
import { KeyboardViewEnum } from "@/types/customKeyboard";
import useInfoModal from "@/store/useInfoModal";
import BarTypeKeyboard from "./BarTypeKeyboard";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";

const CustomKeyboard = ({
  animatedIndex,
}: {
  animatedIndex: SharedValue<number>;
}) => {
  const {
    isVisible,
    keyboardView,
    closeKeyboard,
    onKeyPress,
    onDelete,
    addOne,
    removeOne,
    addDot,
    selectedRPE,
    setKeyboardView,
    partials,
    setPartials,
    activeField,
    focusNextInput,
    setRPE,
    selectedBarType,
    setBarType,
  } = useCustomKeyboard();
  const { openModal } = useInfoModal();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(animatedIndex.value, [0, 1], [250, 0]) },
    ],
  }));
  const fieldName = activeField?.split("-")[activeField?.split("-").length - 1];
  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { display: isVisible ? "flex" : "none" },
      ]}
    >
      {keyboardView === KeyboardViewEnum.DEFAULT && (
        <DefaultKeyboard
          {...{
            onKeyPress,
            onDelete,
            addDot,
            addOne,
            removeOne,
            closeKeyboard,
            setKeyboardView,
            fieldName: fieldName!,
            focusNextInput,
          }}
        />
      )}
      {keyboardView === KeyboardViewEnum.RPE && (
        <RPEKeyboard
          {...{
            selectedRPE,
            setRPE,
            setKeyboardView,
            openInfoModal: openModal,
          }}
        />
      )}
      {keyboardView === KeyboardViewEnum.PARTIALS && (
        <PartialsKeyboard
          {...{
            partials,
            setPartials,
            setKeyboardView,
            openInfoModal: openModal,
          }}
        />
      )}
      {keyboardView === KeyboardViewEnum.BAR_TYPE && (
        <BarTypeKeyboard
          {...{
            selectedBarType,
            setBarType,
            setKeyboardView,
          }}
        />
      )}
    </Animated.View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: theme.jetBlack,
      paddingBottom: 20,
      height: KEYBOARD_HEIGHT,
    },
  });
export default CustomKeyboard;
