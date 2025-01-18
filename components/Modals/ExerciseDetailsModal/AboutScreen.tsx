import CustomImage from "@/components/CustomImage";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  instructions: undefined | string;
  image: undefined | string;
};

const AboutScreen = ({ instructions, image }: Props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image && <CustomImage height={200} width={200} imageUrl={image} />}
      {instructions && (
        <View style={styles.instructionsWrapper}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>{instructions}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 10, padding: 10 },
  instructionsWrapper: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  instructionsTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  instructionsText: {
    fontSize: 16,
  },
});

export default AboutScreen;
