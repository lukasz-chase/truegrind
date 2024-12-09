import { AppColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  setOrder: number;
  exerciseId: string;
  userId: string;
  bulkUpdateSet: (newValue: {
    reps: number;
    weight: number;
    rpe: number | null;
    partials: number | null;
  }) => void;
};

const SetHistory = ({ exerciseId, setOrder, userId, bulkUpdateSet }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<{
    reps: number;
    weight: number;
    rpe: number | null;
    partials: number | null;
  } | null>(null);
  const fetchLastSet = async () => {
    const { data, error } = await supabase
      .from("sets_history")
      .select(`reps, weight, rpe, partials`)
      .eq("exercise_id", exerciseId)
      .eq("user_id", userId)
      .eq('"order"', setOrder)
      .order("created_at", { ascending: false })
      .limit(1)
      .single<{
        reps: number;
        weight: number;
        rpe: number | null;
        partials: number | null;
      }>();
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
            fontSize: exerciseHistory.rpe || exerciseHistory.partials ? 14 : 18,
          },
        ]}
      >
        {exerciseHistory.weight} x {exerciseHistory.reps}
        {exerciseHistory.rpe && ` @${exerciseHistory.rpe} `}
        {exerciseHistory.partials && `+${exerciseHistory.partials}`}
      </Text>
    );
  };
  const handlePress = () => {
    bulkUpdateSet(exerciseHistory!);
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
