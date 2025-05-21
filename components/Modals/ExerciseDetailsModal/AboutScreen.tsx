import CustomImage from "@/components/CustomImage";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  instructions: undefined | string;
  image: undefined | string;
};

const AboutScreen = ({ instructions, image }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
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

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      gap: 10,
      padding: 10,
      backgroundColor: theme.background,
    },
    instructionsWrapper: {
      width: "100%",
      gap: 10,
      alignItems: "center",
    },
    instructionsTitle: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    instructionsText: {
      fontSize: 16,
      color: theme.textColor,
    },
  });

export default AboutScreen;
