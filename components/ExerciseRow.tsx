import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { Exercise } from "@/types/exercises";

const ExerciseRow = ({
  exercise,
  numberOfSets,
}: {
  exercise: Exercise;
  numberOfSets?: number;
}) => {
  return (
    <View style={styles.exerciseItem}>
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
    </View>
  );
};

export default ExerciseRow;

const styles = StyleSheet.create({
  exerciseItem: {
    borderRadius: 8,
    marginVertical: 8,
    color: "#25292e",
    flexDirection: "row",
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
