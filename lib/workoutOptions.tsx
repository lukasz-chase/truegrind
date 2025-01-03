import {
  EvilIcons,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { AppColors } from "@/constants/colors";
import { formatTime } from "@/lib/helpers";
import { Text, View } from "react-native";

export const getOptions = ({
  exerciseTimer,
  switchToAutoRestScreen,
  closeModal,
  setWarningState,
  openExercisesModal,
  noteHandler,
  generateNoteOptionName,
  removeFromSuperset,
  superset,
}: {
  exerciseTimer: number | null;
  switchToAutoRestScreen: () => void;
  closeModal: () => void;
  setWarningState: React.Dispatch<
    React.SetStateAction<{ isVisible: boolean; shouldShow: boolean }>
  >;
  openExercisesModal: () => void;
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
    cb: openExercisesModal,
    conditionToDisplay: true,
  },
  {
    Icon: <EvilIcons name="close" size={24} color={AppColors.red} />,
    title: "Remove From Superset",
    cb: () => {
      removeFromSuperset();
      closeModal();
    },
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
        <Text style={{ color: "white" }}>
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
    cb: () => {
      setWarningState((state) => ({ ...state, shouldShow: true }));
      closeModal();
    },
    conditionToDisplay: true,
  },
];
