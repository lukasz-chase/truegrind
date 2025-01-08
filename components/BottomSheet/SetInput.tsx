import { useEffect, useRef, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { AppColors } from "@/constants/colors";
import { ExerciseSet } from "@/types/exercisesSets";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { KEYBOARD_HEIGHT, rpeValues } from "@/constants/keyboard";
import useBottomSheet from "@/store/useBottomSheet";

const CARET_WIDTH = 2;

type SetInputProps = {
  value: number | null;
  completed: boolean;
  exerciseSetId: string;
  updateSet: (newValue: any, name: keyof ExerciseSet) => void;
  fieldName: "weight" | "reps";
  updateStoreSetField: (newValues: Partial<ExerciseSet>) => void;
  localStateRpeValue: number | null;
  localStatePartialsValue: number | null;
};

const SetInput = ({
  value,
  completed,
  exerciseSetId,
  updateSet,
  fieldName,
  updateStoreSetField,
  localStateRpeValue,
  localStatePartialsValue,
}: SetInputProps) => {
  const [wasThereValueOnPress, setWasThereValueOnPress] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [rpe, setRpe] = useState<number | null>(localStateRpeValue);

  const caretOpacity = useSharedValue(0);

  const inputRef = useRef<View>(null);

  const {
    openKeyboard,
    activeField: activeSetInput,
    setPartials,
    setRPEInStore,
  } = useCustomKeyboard();
  const { bottomSheetScrollViewRef } = useBottomSheet();

  const repsInput = fieldName === "reps";
  const setInputId = `${exerciseSetId}-${fieldName}`;
  const isActive = activeSetInput === setInputId;

  useEffect(() => {
    setRpe(localStateRpeValue);
  }, [localStateRpeValue]);

  const setRPELocallyAndInStore = (value: number | null) => {
    setRpe(value);
    updateStoreSetField({ rpe: value });
  };
  const setValueHandler = (value: string) => {
    if (repsInput && !value) updateStoreSetField({ completed: false });
    updateSet(value, fieldName);
    setWasThereValueOnPress(false);
  };

  const handleInputPress = () => {
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
    setWasThereValueOnPress(value !== "");
    openKeyboard(
      setInputId,
      setValueHandler,
      setRPELocallyAndInStore,
      updateSet
    );
    if (localStatePartialsValue) setPartials(localStatePartialsValue);
    if (rpe) {
      const keyboardRPE = rpeValues.find((mapRpe) => rpe === mapRpe.value);
      setRPEInStore(keyboardRPE!);
    }
  };

  const caretStyle = useAnimatedStyle(() => {
    return {
      left: textWidth < 4 ? 0 : textWidth + CARET_WIDTH,
      opacity: caretOpacity.value,
    };
  });

  return (
    <Pressable
      style={[
        styles.textInput,
        {
          backgroundColor: completed ? AppColors.lightGreen : AppColors.gray,
          borderColor: isActive ? "black" : "transparent",
          width: repsInput && (localStatePartialsValue || rpe) ? "90%" : "100%",
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
          {value !== "" && value}
        </Text>
        {isActive && !wasThereValueOnPress && (
          <Animated.View style={[styles.caret, caretStyle]} />
        )}
      </View>
      {repsInput && rpe && (
        <View style={styles.rpeBadge}>
          <Text>{rpe}</Text>
        </View>
      )}
      {repsInput && localStatePartialsValue && (
        <View style={styles.partials}>
          <Text>+{localStatePartialsValue}</Text>
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
  partials: {
    position: "absolute",
    right: -23,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SetInput;
