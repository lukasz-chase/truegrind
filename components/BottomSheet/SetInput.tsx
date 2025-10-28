import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { BarTypeEnum, ExerciseSet } from "@/types/exercisesSets";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { BAR_TYPES, KEYBOARD_HEIGHT, RPE_VALUES } from "@/constants/keyboard";
import useBottomSheet from "@/store/useBottomSheet";
import useThemeStore from "@/store/useThemeStore";
import { AppThemeEnum, ThemeColors } from "@/types/user";
import { useShallow } from "zustand/shallow";

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

  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const inputRef = useRef<View>(null);

  const {
    openKeyboard,
    activeSetInput,
    setPartials,
    registerInput,
    unRegisterInput,
    setRPE,
    updateInputProps,
    setBarType,
  } = useCustomKeyboard(
    useShallow((state) => ({
      openKeyboard: state.openKeyboard,
      activeSetInput: state.activeField,
      setPartials: state.setPartials,
      registerInput: state.registerInput,
      unRegisterInput: state.unRegisterInput,
      setRPE: state.setRPE,
      updateInputProps: state.updateInputProps,
      setBarType: state.setBarType,
    }))
  );
  const bottomSheetScrollViewRef = useBottomSheet(
    (state) => state.bottomSheetScrollViewRef
  );

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
    return () => {
      unRegisterInput(setInputId);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      updateUI();
      handleInputPress();
    }
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
      const keyboardRPE = RPE_VALUES.find(
        (mapRpe) => rpeValue === mapRpe.value
      );
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
    const foundBarType = BAR_TYPES.find((bar) => bar.name === barType);
    return foundBarType?.weight;
  };
  return (
    <Pressable
      style={[
        styles.textInput,
        {
          backgroundColor: completed
            ? theme.lightGreen
            : isNoDataInputError
            ? theme.red
            : mode === AppThemeEnum.DARK
            ? theme.black
            : theme.gray,
          borderColor: isActive ? theme.black : "transparent",
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
                ? theme.blue
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
          <Text style={{ color: theme.white }}>+{getBarType()}</Text>
        </View>
      )}
      {repsInput && partialsValue && (
        <View style={styles.partials}>
          <Text style={{ color: theme.textColor }}>+{partialsValue}</Text>
        </View>
      )}
    </Pressable>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
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
      color: theme.textColor,
    },
    caret: {
      position: "absolute",
      width: CARET_WIDTH,
      height: 25,
      backgroundColor: theme.blue,
    },
    rpeBadge: {
      position: "absolute",
      right: 0,
      top: 0,
      transform: [{ translateX: 10 }, { translateY: -10 }],
      height: 20,
      width: 20,
      borderRadius: 5,
      backgroundColor: theme.blue,
      alignItems: "center",
      justifyContent: "center",
    },
    barTypeBadge: {
      width: 25,
      backgroundColor: theme.darkGray,
    },
    partials: {
      position: "absolute",
      right: -23,
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default SetInput;
