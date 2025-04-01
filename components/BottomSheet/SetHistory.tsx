import { AppColors } from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SetHistoryProps } from "@/types/exercisesSets";
import { fetchSetsHistory } from "@/lib/exerciseSetsService";
import { barTypes } from "@/constants/keyboard";

type Props = {
  setOrder: number;
  exerciseId: string;
  userId: string;
  bulkUpdateSet: (newValue: SetHistoryProps) => void;
};

const SetHistory = ({ exerciseId, setOrder, userId, bulkUpdateSet }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [exerciseHistory, setExerciseHistory] =
    useState<SetHistoryProps | null>(null);
  const fetchLastSet = async () => {
    const { data, error } = await fetchSetsHistory(
      exerciseId,
      userId,
      setOrder
    );
    if (error) {
      //error code PGRST116 means there is no data
      setDisabled(true);
      if (error.code !== "PGRST116") {
        console.log(error);
      }
    }
    if (data) {
      setDisabled(false);
      setExerciseHistory(data);
    }
  };
  useEffect(() => {
    fetchLastSet();
  }, []);
  const renderPreviousSet = () => {
    if (!exerciseHistory)
      return <AntDesign name="minus" size={42} color={AppColors.gray} />;
    const getBarType = () => {
      const barType = barTypes.find(
        (bar) => bar.name === exerciseHistory.bar_type
      );
      return ` +${barType?.weight}`;
    };
    return (
      <Text
        style={[
          styles.previousSet,
          {
            color: disabled ? AppColors.gray : "black",
            fontSize: exerciseHistory.rpe || exerciseHistory.partials ? 14 : 16,
          },
        ]}
      >
        {exerciseHistory.weight}
        {exerciseHistory.bar_type && getBarType()} x {exerciseHistory.reps}
        {exerciseHistory.rpe && ` @${exerciseHistory.rpe} `}
        {exerciseHistory.partials && `+${exerciseHistory.partials}`}
        {exerciseHistory.is_dropset && "(D)"}
        {exerciseHistory.is_warmup && "(W)"}
      </Text>
    );
  };
  const handlePress = () => {
    if (!exerciseHistory) return;
    bulkUpdateSet(exerciseHistory);
    setDisabled(true);
  };
  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={styles.previusButton}
    >
      {renderPreviousSet()}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  previusButton: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  previousSet: {
    color: AppColors.gray,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SetHistory;
