import {
  EvilIcons,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { AppColors } from "@/constants/colors";
import { Text, View } from "react-native";
import { formatTime } from "@/utils/calendar";

export default ({
  exerciseTimer,
  switchToAutoRestScreen,
  openWarningModalHandler,
  openExerciseModalHandler,
  noteHandler,
  generateNoteOptionName,
  removeFromSuperset,
  superset,
}: {
  exerciseTimer: number | null;
  switchToAutoRestScreen: () => void;
  openWarningModalHandler: () => void;
  openExerciseModalHandler: () => void;
  noteHandler: () => void;
  generateNoteOptionName: () => string;
  removeFromSuperset: () => void;
  superset: string | null;
}) => [
  {
    Icon: <EvilIcons name="pencil" size={24} color={AppColors.blue} />,
    title: generateNoteOptionName(),
    cb: noteHandler,
    conditionToDisplay: true,
  },
  {
    Icon: (
      <MaterialCommunityIcons
        name="arrow-u-left-top"
        size={24}
        color={AppColors.blue}
      />
    ),
    title: "Replace Exercise",
    cb: openExerciseModalHandler,
    conditionToDisplay: true,
  },
  {
    Icon: <EvilIcons name="close" size={24} color={AppColors.red} />,
    title: "Remove From Superset",
    cb: removeFromSuperset,
    conditionToDisplay: !!superset,
  },
  {
    Icon: <Ionicons name="timer-outline" size={24} color={AppColors.blue} />,
    title: "Auto Rest Timer",
    rightSide: (
      <View
        style={{
          marginLeft: "auto",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ color: AppColors.white }}>
          {!!exerciseTimer ? formatTime(exerciseTimer) : "Off"}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={AppColors.blue}
        />
      </View>
    ),
    cb: switchToAutoRestScreen,
    conditionToDisplay: true,
  },
  {
    Icon: <EvilIcons name="close" size={24} color={AppColors.red} />,
    title: "Remove Exercise",
    cb: openWarningModalHandler,
    conditionToDisplay: true,
  },
];
