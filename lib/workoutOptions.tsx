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
  setIsVisible,
  setWarningState,
}: {
  exerciseTimer: number | null;
  switchToAutoRestScreen: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setWarningState: React.Dispatch<
    React.SetStateAction<{ isVisible: boolean; shouldShow: boolean }>
  >;
}) => [
  {
    Icon: <EvilIcons name="pencil" size={24} color={AppColors.blue} />,
    title: "Add a Note",
    cb: () => setWarningState((state) => ({ ...state, shouldShow: true })),
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
    cb: () => setWarningState((state) => ({ ...state, shouldShow: true })),
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
  },
  {
    Icon: <EvilIcons name="close" size={24} color={AppColors.red} />,
    title: "Remove Exercise",
    cb: () => {
      setWarningState((state) => ({ ...state, shouldShow: true }));
      setIsVisible(false);
    },
  },
];
