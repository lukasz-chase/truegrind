import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { AppColors } from "@/constants/colors";
import { ExerciseSet } from "@/types/exercisesSets";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { rpeValues } from "@/constants/keyboard";

type SetInputProps = {
  value: string | number;
  completed: boolean;
  exerciseSetId: string;
  updateSet: (newValue: any, name: keyof ExerciseSet) => void;
  fieldName: "weight" | "reps";
  updateStoreSetField: (newValue: any, name: keyof ExerciseSet) => void;
  localStateRpeValue: number | null;
  localStatePartialsValue: number | null;
};

const CARET_WIDTH = 2;

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

  useEffect(() => {
    setRpe(localStateRpeValue);
  }, [localStateRpeValue]);

  const repsInput = fieldName === "reps";
  const {
    openKeyboard,
    activeField: activeSetInput,
    setPartials,
    setRPEInStore,
  } = useCustomKeyboard();

  const setInputId = `${exerciseSetId}-${fieldName}`;
  const isActive = activeSetInput === setInputId;

  const caretOpacity = useSharedValue(0);

  const setRPELocallyAndInStore = (value: number | null) => {
    setRpe(value);
    updateStoreSetField(value, "rpe");
  };
  const setValueHandler = (value: string) => {
    if (repsInput && !value) updateStoreSetField(false, "completed");
    updateSet(value, fieldName);
    setWasThereValueOnPress(false);
  };

  useEffect(() => {
    caretOpacity.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      caretOpacity.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));
  const caretStyle = useMemo(
    () => [
      {
        left: textWidth < 4 ? 0 : textWidth + CARET_WIDTH,
      },
      animatedStyle,
    ],
    [animatedStyle, textWidth]
  );
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
      onPress={() => {
        setWasThereValueOnPress(value !== 0);
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
      }}
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
          {value === 0 ? "" : value}
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
    height: 26,
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
    top: "50%",
    transform: [{ translateY: "-50%" }],
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SetInput;
