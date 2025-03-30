import { Pressable, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AppColors } from "@/constants/colors";
import Octicons from "@expo/vector-icons/Octicons";

type CompleteSetButtonProps = {
  completeSet: () => void;
  completed: boolean;
  reps: number | null;
  disabled: boolean;
};

const CompleteSetButton = ({
  completeSet,
  completed,
  reps,
  disabled,
}: CompleteSetButtonProps) => {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: completed ? AppColors.green : AppColors.gray,
          opacity: !reps ? 0.3 : 1,
        },
      ]}
      disabled={!reps || disabled}
      onPress={completeSet}
    >
      {disabled ? (
        <Octicons name="dash" size={24} color="black" />
      ) : (
        <AntDesign
          name="check"
          size={20}
          color={completed ? "white" : "black"}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 40,
  },
});

export default CompleteSetButton;
