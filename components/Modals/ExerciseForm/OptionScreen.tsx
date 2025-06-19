import { EQUIPMENT_FILTERS, MUSCLE_FILTERS } from "@/constants/exerciseFilters";
import useThemeStore from "@/store/useThemeStore";
import {
  exerciseFormData,
  exerciseFormScreensEnum,
  exerciseFormScreenType,
} from "@/types/exerciseForm";
import { ThemeColors } from "@/types/user";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  currentScreen: exerciseFormScreenType;
  switchToScreen: (screen: exerciseFormScreenType, index: number) => void;
  setExerciseData: React.Dispatch<React.SetStateAction<exerciseFormData>>;
  muscle: string;
  equipment: string;
};

const OptionScreen = ({
  currentScreen,
  switchToScreen,
  setExerciseData,
  muscle,
  equipment,
}: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const handlePress = (value: string) => {
    if (currentScreen === exerciseFormScreensEnum.Equipment) {
      setExerciseData((prev) => ({ ...prev, equipment: value }));
    } else {
      setExerciseData((prev) => ({ ...prev, muscle: value }));
    }
    switchToScreen(exerciseFormScreensEnum.Main, 0);
  };
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => switchToScreen(exerciseFormScreensEnum.Main, 0)}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={theme.blue}
          />
        </Pressable>
        <Text style={styles.title}>
          Select{" "}
          {currentScreen === exerciseFormScreensEnum.Equipment
            ? "Equipment"
            : "Muscle"}
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={
          currentScreen === exerciseFormScreensEnum.Equipment
            ? EQUIPMENT_FILTERS
            : MUSCLE_FILTERS
        }
        keyExtractor={(item) => item.value}
        style={styles.listWrapper}
        renderItem={({ item }) => (
          <Pressable
            style={styles.listItem}
            onPress={() => handlePress(item.value)}
          >
            <Text
              style={[
                styles.listItemText,
                {
                  color:
                    item.value === muscle || item.value === equipment
                      ? theme.blue
                      : theme.textColor,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    header: {
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      width: "100%",
      marginBottom: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    container: {
      flexDirection: "row",
    },
    screen: {
      width: "100%",
      padding: 10,
    },
    listWrapper: {
      height: 200,
    },
    listItem: {
      paddingVertical: 10,
    },
    listItemText: {
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default OptionScreen;
