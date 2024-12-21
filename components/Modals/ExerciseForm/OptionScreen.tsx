import { AppColors } from "@/constants/colors";
import { equipmentFilters, muscleFilters } from "@/constants/exerciseFilters";
import { exerciseFormData } from "@/types/exerciseDetails";
import {
  exerciseFormScreensEnum,
  exerciseFormScreenType,
} from "@/types/exerciseForm";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
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
            color={AppColors.blue}
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
            ? equipmentFilters
            : muscleFilters
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
                      ? AppColors.blue
                      : AppColors.black,
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

const styles = StyleSheet.create({
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
  },
  container: {
    flexDirection: "row",
  },
  imageContainer: {
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  image: {
    width: 200,
    aspectRatio: 1,
  },
  screen: {
    width: "100%",
    padding: 10,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  linkRightSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  linkText: {
    fontSize: 18,
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
