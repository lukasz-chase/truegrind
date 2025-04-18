import { useEffect, useRef, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { AppColors } from "@/constants/colors";
import { BarTypeEnum, ExerciseSet } from "@/types/exercisesSets";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { barTypes, KEYBOARD_HEIGHT, rpeValues } from "@/constants/keyboard";
import useBottomSheet from "@/store/useBottomSheet";

const CARET_WIDTH = 2;

type SetInputProps = {
  value: number | null;
  completed: boolean;
  exerciseSetId: string;
  updateSet: (newValue: Partial<ExerciseSet>) => void;
  fieldName: "weight" | "reps";
  rpeValue: number | null;
  partialsValue: number | null;
  hasCustomTimer?: boolean;
  completeSet: () => void;
  isNoDataInputError: boolean;
  barType: BarTypeEnum | null;
};

const SetInput = ({
  value,
  completed,
  exerciseSetId,
  updateSet,
  fieldName,
  rpeValue,
  partialsValue,
  hasCustomTimer,
  completeSet,
  isNoDataInputError,
  barType,
}: SetInputProps) => {
  const [wasThereValueOnPress, setWasThereValueOnPress] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const caretOpacity = useSharedValue(0);

  const inputRef = useRef<View>(null);

  const {
    openKeyboard,
    activeField: activeSetInput,
    setPartials,
    registerInput,
    setRPE,
    updateInputProps,
    setBarType,
  } = useCustomKeyboard();
  const { bottomSheetScrollViewRef } = useBottomSheet();

  const repsInput = fieldName === "reps";
  const setInputId = `${exerciseSetId}-${fieldName}`;
  const isActive = activeSetInput === setInputId;

  const setValueHandler = (value: string) => {
    updateSet({
      [fieldName]: value,
      ...(repsInput && !value ? { completed: false } : {}),
    });
    setWasThereValueOnPress(false);
  };

  useEffect(() => {
    registerInput(setInputId, setValueHandler);
  }, [setInputId, setValueHandler]);

  useEffect(() => {
    if (isActive) updateUI();
  }, [isActive]);
  const updateUI = () => {
    inputRef.current?.measureInWindow((pageX, pageY, width, height) => {
      setTimeout(() => {
        bottomSheetScrollViewRef?.current
          ?.getScrollResponder()
          .scrollResponderScrollNativeHandleToKeyboard(
            inputRef.current!,
            KEYBOARD_HEIGHT * 2,
            true
          );
      }, 20);
    });

    caretOpacity.value = 0;
    caretOpacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
    setWasThereValueOnPress(!!value);
  };
  const handleInputPress = () => {
    openKeyboard();
    updateInputProps(
      setInputId,
      setValueHandler,
      updateSet,
      completeSet,
      completed,
      value,
      hasCustomTimer
    );
    if (partialsValue) setPartials(partialsValue);
    if (rpeValue) {
      const keyboardRPE = rpeValues.find((mapRpe) => rpeValue === mapRpe.value);
      setRPE(keyboardRPE!);
    }
    if (barType) setBarType(barType);
  };

  const caretStyle = useAnimatedStyle(() => {
    return {
      left: textWidth < 4 ? 0 : textWidth + CARET_WIDTH,
      opacity: caretOpacity.value,
    };
  });
  const getBarType = () => {
    const foundBarType = barTypes.find((bar) => bar.name === barType);
    return foundBarType?.weight;
  };
  return (
    <Pressable
      style={[
        styles.textInput,
        {
          backgroundColor: completed
            ? AppColors.lightGreen
            : isNoDataInputError
            ? AppColors.red
            : AppColors.gray,
          borderColor: isActive ? AppColors.black : "transparent",
          width: repsInput && (partialsValue || rpeValue) ? "90%" : "100%",
        },
      ]}
      ref={inputRef}
      onPress={handleInputPress}
    >
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor:
              activeSetInput === setInputId && wasThereValueOnPress
                ? AppColors.blue
                : "transparent",
          },
        ]}
      >
        <Text
          style={styles.text}
          onLayout={(event) => {
            setTextWidth(event.nativeEvent.layout.width);
          }}
        >
          {value && value}
        </Text>

        {isActive && !wasThereValueOnPress && (
          <Animated.View style={[styles.caret, caretStyle]} />
        )}
      </View>
      {repsInput && rpeValue && (
        <View style={styles.rpeBadge}>
          <Text>{rpeValue}</Text>
        </View>
      )}
      {!repsInput && barType && (
        <View style={[styles.rpeBadge, styles.barTypeBadge]}>
          <Text style={{ color: AppColors.white }}>+{getBarType()}</Text>
        </View>
      )}
      {repsInput && partialsValue && (
        <View style={styles.partials}>
          <Text>+{partialsValue}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "auto",
  },
  text: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  caret: {
    position: "absolute",
    width: CARET_WIDTH,
    height: 25,
    backgroundColor: AppColors.blue,
  },
  rpeBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    transform: [{ translateX: 10 }, { translateY: -10 }],
    height: 20,
    width: 20,
    borderRadius: 5,
    backgroundColor: AppColors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  barTypeBadge: {
    width: 25,
    backgroundColor: AppColors.darkGray,
  },
  partials: {
    position: "absolute",
    right: -23,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SetInput;
