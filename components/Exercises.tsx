import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Exercise } from "@/types/exercises";
import { StyleSheet, View, Pressable, Text, SectionList } from "react-native";
import ExerciseRow from "@/components/ExerciseRow";
import { AppColors } from "@/constants/colors";
import ExerciseFiltersModal from "./Modals/ExerciseFiltersModal";
import { equipmentFilters, muscleFilters } from "@/constants/exerciseFilters";
import CustomTextInput from "./CustomTextInput";
import exercisesStore from "@/store/exercisesStore";

type Props = {
  onPress: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
};

const Exercises = ({ onPress, selectedExercises }: Props) => {
  const { exercises, setExercises } = exercisesStore();
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [muscleModalVisible, setMuscleModalVisible] = useState(false);
  const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);

  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const [frequentExercises, setFrequentExercises] = useState<Exercise[]>([]);

  const muscleRef = useRef(null);
  const equipmentRef = useRef(null);

  useEffect(() => {
    if (exercises.length === 0) {
      getExercises();
    }

    getRecentExercises();
    getFrequentExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [selectedEquipment, selectedMuscle, searchQuery, exercises]);

  const getExercises = async () => {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .order("name", { ascending: true })
      .returns<Exercise[]>();

    if (error) {
      console.error("Error fetching exercises:", error);
      return;
    }
    if (data) {
      setExercises(data);
      setFilteredExercises(data);
    }
  };

  const getRecentExercises = async () => {
    const { data, error } = await supabase
      .from("exercises_history")
      .select("id, exercise_id, created_at, exercises!inner(*)")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching recent exercises:", error);
      return;
    }

    if (data) {
      const mapped = data.map((row) => row.exercises) as Exercise[];
      setRecentExercises(mapped);
    }
  };

  const getFrequentExercises = async () => {
    const { data, error } = await supabase
      .from("exercises")
      .select("id, exercises_history(count)");

    if (error) {
      console.error("Error fetching frequent exercises:", error);
      return;
    }

    if (data) {
      const mostFrequentExercises = data
        .sort(
          (a, b) => a.exercises_history[0].count - b.exercises_history[0].count
        )
        .slice(0, 4)
        .map((item) => item.id);
      const { data: exercises, error } = await supabase
        .from("exercises")
        .select("*")
        .in("id", mostFrequentExercises);

      if (exercises) {
        setFrequentExercises(exercises);
      }
    }
  };

  // Filter logic for the main exercise list
  const filterExercises = () => {
    const filtered = exercises.filter((exercise) => {
      return (
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedMuscle === "" || exercise.muscle === selectedMuscle) &&
        (selectedEquipment === "" || exercise.equipment === selectedEquipment)
      );
    });
    setFilteredExercises(filtered);
  };

  // Utility: Group exercises by first letter (A–Z) for the default "All Exercises" section
  const sectionsByAlphabet = groupExercisesByAlphabet(filteredExercises);

  // Build the data for SectionList.
  // We show two special sections for recent/frequent, followed by A–Z.
  const sections = [
    { title: "Recently Used", data: recentExercises },
    { title: "Frequently Used", data: frequentExercises },
    ...sectionsByAlphabet,
  ];

  return (
    <>
      <View style={styles.container}>
        <CustomTextInput
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Search"
        />
        <View style={styles.pickerContainer}>
          <Pressable
            style={[
              styles.dropdownButton,
              {
                backgroundColor: selectedMuscle
                  ? AppColors.blue
                  : AppColors.gray,
              },
            ]}
            onPress={() => setMuscleModalVisible(true)}
            ref={muscleRef}
          >
            <Text
              style={[
                styles.dropdownButtonText,
                { color: selectedMuscle ? "white" : "black" },
              ]}
            >
              {selectedMuscle || "Any Body Part"}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.dropdownButton,
              {
                backgroundColor: selectedEquipment
                  ? AppColors.blue
                  : AppColors.gray,
              },
            ]}
            onPress={() => setEquipmentModalVisible(true)}
            ref={equipmentRef}
          >
            <Text
              style={[
                styles.dropdownButtonText,
                { color: selectedEquipment ? "white" : "black" },
              ]}
            >
              {selectedEquipment || "Any Equipment"}
            </Text>
          </Pressable>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseRow
              exercise={item}
              onPress={onPress}
              isSelected={!!selectedExercises.find((ex) => ex.id === item.id)}
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
        />
      </View>

      {/* Muscle modal */}
      {!equipmentModalVisible && (
        <ExerciseFiltersModal
          data={muscleFilters}
          anchorCorner="LEFT"
          anchorRef={muscleRef}
          closeModal={() => setMuscleModalVisible(false)}
          isVisible={muscleModalVisible}
          onPress={(muscle: string) => {
            if (selectedMuscle === muscle) setSelectedMuscle("");
            else setSelectedMuscle(muscle);
            setMuscleModalVisible(false);
          }}
          value={selectedMuscle}
        />
      )}

      {/* Equipment modal */}
      {!muscleModalVisible && (
        <ExerciseFiltersModal
          data={equipmentFilters}
          anchorCorner="RIGHT"
          anchorRef={equipmentRef}
          closeModal={() => setEquipmentModalVisible(false)}
          isVisible={equipmentModalVisible}
          onPress={(equipment: string) => {
            if (selectedEquipment === equipment) setSelectedEquipment("");
            else setSelectedEquipment(equipment);
            setEquipmentModalVisible(false);
          }}
          value={selectedEquipment}
        />
      )}
    </>
  );
};

// Utility function for grouping exercises by first letter
function groupExercisesByAlphabet(exercises: Exercise[]) {
  const grouped = exercises.reduce((acc, exercise) => {
    const firstLetter = exercise.name.charAt(0)?.toUpperCase() ?? "#";
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  // Convert object to array of { title, data } sorted by the letter
  return Object.keys(grouped)
    .sort()
    .map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    height: "100%",
  },
  pickerContainer: {
    marginVertical: 10,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButton: {
    padding: 5,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionHeader: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: AppColors.gray,
    backgroundColor: "white",
  },
  sectionHeaderText: {
    fontWeight: "bold",
  },
});

export default Exercises;
