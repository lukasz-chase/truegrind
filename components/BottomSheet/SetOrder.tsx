import useSetOptionsModal from "@/store/useSetOptionsModal";
import useThemeStore from "@/store/useThemeStore";
import { AppThemeEnum, ThemeColors } from "@/types/user";
import { useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  isCompleted: boolean;
  isWarmup: boolean;
  isDropset: boolean;
  order: number;
  exerciseId: string;
  exerciseSetId: string;
};

const SetOrder = ({
  isCompleted,
  isWarmup,
  isDropset,
  order,
  exerciseId,
  exerciseSetId,
}: Props) => {
  const { openModal } = useSetOptionsModal();
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const buttonRef = useRef(null);

  const getData = () => {
    if (isWarmup) {
      return {
        backgroundColor: theme.lightOrange,
        color: theme.orange,
        text: "W",
      };
    }
    if (isDropset) {
      return {
        backgroundColor: theme.lightPurple,
        color: theme.purple,
        text: "D",
      };
    }
    if (isCompleted) {
      return {
        backgroundColor: theme.lightGreen,
        color: theme.textColor,
        text: order,
      };
    }
    return {
      backgroundColor: mode === AppThemeEnum.DARK ? theme.black : theme.gray,
      color: theme.textColor,
      text: order,
    };
  };
  return (
    <Pressable
      style={[
        styles.rowButton,
        {
          backgroundColor: getData().backgroundColor,
        },
      ]}
      onPress={() => openModal({ exerciseId, exerciseSetId, buttonRef })}
      ref={buttonRef}
    >
      <Text style={[styles.rowButtonText, { color: getData().color }]}>
        {getData().text}
      </Text>
    </Pressable>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    rowButton: {
      backgroundColor: theme.gray,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      height: 25,
      width: 35,
    },
    rowButtonText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default SetOrder;
