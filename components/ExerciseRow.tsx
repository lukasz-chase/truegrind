import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Exercise } from "@/types/exercises";
import { AppColors } from "@/constants/colors";
import { Pressable } from "react-native";
import CustomImage from "./CustomImage";

type Props = {
  exercise: Exercise;
  numberOfSets?: number;
  onPress: (exercise: Exercise) => void;
  isSelected: boolean;
};

const ExerciseRow = ({
  exercise,
  numberOfSets,
  onPress,
  isSelected,
}: Props) => {
  return (
    <Pressable
      onPress={() => onPress(exercise)}
      style={[
        styles.exerciseItem,
        { backgroundColor: isSelected ? AppColors.blue : AppColors.white },
      ]}
    >
      {exercise.image ? (
        <CustomImage imageUrl={exercise.image} height={50} width={50} />
      ) : (
        <View style={styles.CustomImage}>
          <Text style={styles.CustomImageText}>{exercise.name.charAt(0)}</Text>
        </View>
      )}

      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>
          {numberOfSets && numberOfSets !== 0 ? `${numberOfSets} x ` : ""}
          {exercise.name}
        </Text>
        <View>
          <Text style={styles.exerciseDetail}>Muscle: {exercise.muscle}</Text>
          <Text style={styles.exerciseDetail}>
            Equipment: {exercise.equipment}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ExerciseRow;

const styles = StyleSheet.create({
  exerciseItem: {
    borderRadius: 8,
    color: AppColors.black,
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
    borderBottomColor: AppColors.gray,
    borderBottomWidth: 1,
  },
  exerciseDetails: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  CustomImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  CustomImageText: {
    fontSize: 32,
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 16,
    maxWidth: "100%", // Ensures it doesn't overflow its container
  },
  exerciseDetail: {
    fontSize: 14,
  },
});
