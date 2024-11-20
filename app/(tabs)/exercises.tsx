import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Exercise } from "@/types/exercises";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
} from "react-native";
import ExerciseRow from "@/components/ExerciseRow";
import { AppColors } from "@/constants/colors";
import RNPickerSelect from "react-native-picker-select";

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");

  useEffect(() => {
    getExercises();
  }, [searchQuery, selectedMuscle]);

  const getExercises = async () => {
    // Build the query with filters
    let query = supabase
      .from("exercises")
      .select()
      .order("name", { ascending: true });

    // Apply muscle filter if selected
    if (selectedMuscle) {
      query = query.eq("muscle", selectedMuscle);
    }

    // Apply search filter if query is provided
    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    // Execute the query
    const { data, error } = await query.returns<Exercise[]>();

    if (data) {
      setExercises(data);
    }
    if (error) throw error;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <TextInput
          placeholder="Search by name"
          placeholderTextColor={AppColors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          underlineColorAndroid="transparent"
        />
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: "Filter by Muscle Group", value: null }}
            value={selectedMuscle}
            onValueChange={(value) => setSelectedMuscle(value)}
            disabled={false}
            items={[
              { label: "All Muscles", value: "" },
              { label: "Chest", value: "chest" },
              { label: "Back", value: "back" },
              { label: "Legs", value: "legs" },
              { label: "Arms", value: "arms" },
              { label: "Shoulders", value: "shoulders" },
            ]}
            style={pickerSelectStyles}
          />
        </View>

        <ScrollView>
          {exercises.map((exercise) => (
            <ExerciseRow key={exercise.id} exercise={exercise} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  pickerContainer: {
    height: 60,
    marginVertical: 20,
    zIndex: 20,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOSContainer: {
    pointerEvents: "none",
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
