import { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Exercise } from "@/types/exercises";
import { Pressable } from "react-native";
import CustomImage from "./CustomImage";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

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
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <Pressable
      onPress={() => onPress(exercise)}
      style={[
        styles.exerciseItem,
        { backgroundColor: isSelected ? theme.blue : theme.background },
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    exerciseItem: {
      borderRadius: 8,

      flexDirection: "row",
      width: "100%",
      paddingVertical: 5,
      borderBottomColor: theme.gray,
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
      color: theme.textColor,
    },
    exerciseName: {
      fontWeight: "bold",
      color: theme.textColor,
      fontSize: 18,
      maxWidth: "100%", // Ensures it doesn't overflow its container
    },
    exerciseDetail: {
      color: theme.textColor,
      fontSize: 16,
    },
  });
