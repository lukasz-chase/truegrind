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

  const muscleRef = useRef(null);
  const equipmentRef = useRef(null);

  useEffect(() => {
    if (exercises.length === 0) getExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [selectedEquipment, selectedMuscle, searchQuery, exercises]);

  const getExercises = async () => {
    const { data, error } = await supabase
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
      return (
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedMuscle === "" || exercise.muscle === selectedMuscle) &&
        (selectedEquipment === "" || exercise.equipment === selectedEquipment)
      );
    });
    setFilteredExercises(filtered);
  };

  // Group exercises by first letter
  const sections = groupExercisesByAlphabet(filteredExercises);

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

        {/* Replace FlatList with SectionList */}
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
          // Optional: show a letter header above each section
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
    // Grab first letter, uppercase it, or fallback to '#'
    const firstLetter = exercise.name.charAt(0)?.toUpperCase() ?? "#";
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  // Convert object to array of { title, data } sorted by title
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
  searchContainer: {
    marginBottom: 12,
  },
  pickerContainer: {
    marginVertical: 10,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exercises: {},
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