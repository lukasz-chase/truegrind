import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

type Props = {
  newTemplateHandler: () => void;
};

const WorkoutCardPreview = ({ newTemplateHandler }: Props) => {
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <TouchableOpacity style={styles.workoutCard} onPress={newTemplateHandler}>
      <Text style={[styles.previewText, { fontSize: 20 }]}>Tap to Add</Text>
      <Text style={styles.previewText}>Or drag template here to move</Text>
    </TouchableOpacity>
  );
};
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    workoutCard: {
      minHeight: 150,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.lightText,
      padding: 30,
      width: "48%",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
    },
    previewText: {
      textAlign: "center",
      color: theme.blue,
      fontSize: 15,
    },
  });

export default WorkoutCardPreview;
