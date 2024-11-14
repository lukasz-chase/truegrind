import { supabase } from "@/lib/supabase";
import { Exercise } from "@/types/exercises";
import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Input } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");

  useEffect(() => {
    getExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedMuscle, exercises]);

  const getExercises = async () => {
    let { data, error } = await supabase
      .from("exercises")
      .select()
      .order("name", { ascending: true })
      .returns<Exercise[]>();

    if (data) {
      setExercises(data);
      setFilteredExercises(data);
    }
    if (error) throw error;
  };

  const filterExercises = () => {
    const filtered = exercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMuscle = selectedMuscle
        ? exercise.muscle === selectedMuscle
        : true;
      return matchesSearch && matchesMuscle;
    });
    setFilteredExercises(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Input
        placeholder="Search by name"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={{ type: "font-awesome", name: "search", color: "#888" }}
        inputStyle={{ color: "#fff" }}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
      />
      {/* Muscle Group Filter */}
      <Picker
        selectedValue={selectedMuscle}
        onValueChange={(value: string) => setSelectedMuscle(value)}
        style={styles.picker}
      >
        <Picker.Item label="All Muscles" value="" />
        <Picker.Item label="Chest" value="chest" />
        <Picker.Item label="Back" value="back" />
        <Picker.Item label="Legs" value="legs" />
        <Picker.Item label="Arms" value="arms" />
        <Picker.Item label="Shoulders" value="shoulders" />
        {/* Add more options based on the muscle groups available in your data */}
      </Picker>

      {/* Exercise List */}
      <ScrollView>
        {filteredExercises.map((exercise) => (
          <View key={exercise.name} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetail}>Muscle: {exercise.muscle}</Text>
            <Text style={styles.exerciseDetail}>
              Equipment: {exercise.equipment}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 16,
  },
  searchContainer: {
    paddingHorizontal: 0,
  },
  inputContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    color: "#fff",
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 12,
  },
  exerciseItem: {
    backgroundColor: "#333",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  exerciseDetail: {
    color: "#bbb",
  },
});
