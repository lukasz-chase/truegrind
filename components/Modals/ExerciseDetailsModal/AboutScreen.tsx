import { Exercise } from "@/types/exercises";
import { Image, StyleSheet, Text, View } from "react-native";

const AboutScreen = ({ exercise }: { exercise: Exercise }) => {
  return (
    <View>
      {exercise.image && (
        <Image
          source={{ uri: exercise.image }}
          style={styles.exerciseImage}
          resizeMode="cover"
        />
      )}
      <Text>Instructions</Text>
      <Text>{exercise.instructions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseImage: {
    width: "90%",
  },
});

export default AboutScreen;
