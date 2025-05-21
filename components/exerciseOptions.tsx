import {
  EvilIcons,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Text, View } from "react-native";
import { formatTime } from "@/utils/calendar";
import { ThemeColors } from "@/types/user";

export default ({
  exerciseTimer,
  switchToAutoRestScreen,
  openWarningModalHandler,
  openExerciseModalHandler,
  noteHandler,
  generateNoteOptionName,
  removeFromSuperset,
  superset,
  theme,
}: {
  exerciseTimer: number | null;
  switchToAutoRestScreen: () => void;
  openWarningModalHandler: () => void;
  openExerciseModalHandler: () => void;
  noteHandler: () => void;
  generateNoteOptionName: () => string;
  removeFromSuperset: () => void;
  superset: string | null;
  theme: ThemeColors;
}) => [
  {
    Icon: <EvilIcons name="pencil" size={24} color={theme.blue} />,
    title: generateNoteOptionName(),
    cb: noteHandler,
    conditionToDisplay: true,
  },
  {
    Icon: (
      <MaterialCommunityIcons
        name="arrow-u-left-top"
        size={24}
        color={theme.blue}
      />
    ),
    title: "Replace Exercise",
    cb: openExerciseModalHandler,
    conditionToDisplay: true,
  },
  {
    Icon: <EvilIcons name="close" size={24} color={theme.red} />,
    title: "Remove From Superset",
    cb: removeFromSuperset,
    conditionToDisplay: !!superset,
  },
  {
    Icon: <Ionicons name="timer-outline" size={24} color={theme.blue} />,
    title: "Auto Rest Timer",
    rightSide: (
      <View
        style={{
          marginLeft: "auto",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ color: theme.white }}>
          {!!exerciseTimer ? formatTime(exerciseTimer) : "Off"}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={theme.blue}
        />
      </View>
    ),
    cb: switchToAutoRestScreen,
    conditionToDisplay: true,
  },
  {
    Icon: <EvilIcons name="close" size={24} color={theme.red} />,
    title: "Remove Exercise",
    cb: openWarningModalHandler,
    conditionToDisplay: true,
  },
];
