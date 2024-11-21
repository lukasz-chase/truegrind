import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { Exercise } from "@/types/exercises";
import { AppColors } from "@/constants/colors";
import { Pressable } from "react-native-gesture-handler";

type Props = {
  exercise: Exercise;
  numberOfSets?: number;
  onPress: (exercise: Exercise) => void;
};

const ExerciseRow = ({ exercise, numberOfSets, onPress }: Props) => {
  return (
    <Pressable onPress={() => onPress(exercise)} style={styles.exerciseItem}>
      <Image
        source={{ uri: exercise.image }}
        style={styles.exerciseImage}
        resizeMode="cover"
      />
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>
          {numberOfSets && `${numberOfSets} x `}
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
    marginVertical: 8,
    color: AppColors.black,
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
    borderBottomColor: AppColors.gray,
    borderBottomWidth: 1,
  },
  exerciseDetails: {
    marginLeft: 12,
    justifyContent: "space-between",
    paddingTop: 5,
    paddingBottom: 5,
  },
  exerciseImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  exerciseDetail: {
    fontSize: 16,
  },
});
