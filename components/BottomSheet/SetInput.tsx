import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TextInput, Pressable, View, Text } from "react-native";
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

type SetInputProps = {
  value: string | number;
  completed: boolean;
  exerciseSetId: string;
  updateSetDetails: (newValue: any, name: keyof ExerciseSet) => void;
  fieldName: "weight" | "reps";
  updateExerciseField: (newValue: any, name: keyof ExerciseSet) => void;
};

const CARET_WIDTH = 2;

const SetInput = ({
  value,
  completed,
  exerciseSetId,
  updateSetDetails,
  fieldName,
  updateExerciseField,
}: SetInputProps) => {
  const [wasThereValueOnPress, setWasThereValueOnPress] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

  const { openKeyboard, activeField: activeSetInput } = useCustomKeyboard();

  const setInputId = `${exerciseSetId}-${fieldName}`;
  const isActive = activeSetInput === setInputId;

  const caretOpacity = useSharedValue(0);

  const setValueHandler = (value: string) => {
    if (fieldName === "reps" && !value) updateExerciseField(false, "completed");
    updateSetDetails(value, fieldName);
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
          borderWidth: isActive ? 2 : 0,
        },
      ]}
      onPress={() => {
        setWasThereValueOnPress(value !== 0);
        openKeyboard(setInputId, setValueHandler);
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    height: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
});

export default SetInput;
