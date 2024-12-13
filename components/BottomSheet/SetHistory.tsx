import { AppColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type SetHistoryProps = {
  reps: number;
  weight: number;
  rpe: number | null;
  partials: number | null;
  is_warmup: boolean;
  is_dropset: boolean;
};

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
    const { data, error } = await supabase
      .from("sets_history")
      .select(`reps, weight, rpe, partials, is_warmup, is_dropset`)
      .eq("exercise_id", exerciseId)
      .eq("user_id", userId)
      .eq('"order"', setOrder)
      .order("created_at", { ascending: false })
      .limit(1)
      .single<SetHistoryProps>();
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
        {exerciseHistory.weight} x {exerciseHistory.reps}
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
