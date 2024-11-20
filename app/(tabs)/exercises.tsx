import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Exercise } from "@/types/exercises";
import {
  View,
  Colors,
  Text,
  Picker,
  TextField,
  Card,
} from "react-native-ui-lib";
import { ScrollView, StyleSheet, SafeAreaView, Image } from "react-native";
import ExerciseRow from "@/components/ExerciseRow";
import { AppColors } from "@/constants/colors";

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
      <View flex backgroundColor={AppColors.black} padding-16>
        {/* Search Bar */}
        <TextField
          placeholder="Search by name"
          placeholderTextColor={Colors.grey40}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          containerStyle={styles.searchContainer}
          underlineColorAndroid="transparent"
        />
        {/* Muscle Group Filter */}
        <Picker
          placeholder="Filter by Muscle Group"
          value={selectedMuscle}
          onChange={(value) => setSelectedMuscle(value as string)}
          style={styles.picker}
        >
          <Picker.Item label="All Muscles" value="" />
          <Picker.Item label="Chest" value="chest" />
          <Picker.Item label="Back" value="back" />
          <Picker.Item label="Legs" value="legs" />
          <Picker.Item label="Arms" value="arms" />
          <Picker.Item label="Shoulders" value="shoulders" />
        </Picker>

        {/* Exercise List */}
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
  picker: {
    height: 40,
    color: "#fff",
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 12,
  },
});
