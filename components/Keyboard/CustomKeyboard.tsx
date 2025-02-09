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
import useInfoModal from "@/store/useInfoModall";

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
    selectRPE,
    setKeyboardView,
    partials,
    setPartials,
    activeField,
  } = useCustomKeyboard();
  const { openModal } = useInfoModal();

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
          }}
        />
      )}
      {keyboardView === KeyboardViewEnum.RPE && (
        <RPEKeyboard
          {...{
            selectedRPE,
            selectRPE,
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1C1C1C",
    paddingBottom: 20,
    height: KEYBOARD_HEIGHT,
  },
});
export default CustomKeyboard;
