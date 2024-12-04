import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Exercise } from "@/types/exercises";
import { StyleSheet, View, Pressable, Text } from "react-native";
import ExerciseRow from "@/components/ExerciseRow";
import { AppColors } from "@/constants/colors";
import { FlatList } from "react-native-gesture-handler";
import ExerciseFiltersModal from "./Modals/ExerciseFiltersModal";
import { equipmentFilters, muscleFilters } from "@/constants/exerciseFilters";
import CustomTextInput from "./CustomTextInput";
type Props = {
  onPress: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
};

const Exercises = ({ onPress, selectedExercises }: Props) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [muscleModalVisible, setMuscleModalVisible] = useState(false);
  const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);

  const muscleRef = useRef(null);
  const equipmentRef = useRef(null);

  useEffect(() => {
    getExercises();
  }, [searchQuery, selectedMuscle, selectedEquipment]);

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

    if (selectedEquipment) {
      query = query.eq("equipment", selectedEquipment);
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
            onPress={() => {
              setMuscleModalVisible(true);
            }}
            ref={muscleRef}
          >
            {selectedMuscle ? (
              <Text style={[styles.dropdownButtonText, { color: "white" }]}>
                {selectedMuscle}
              </Text>
            ) : (
              <Text style={styles.dropdownButtonText}>Any Body Part</Text>
            )}
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
            ref={equipmentRef}
            onPress={() => {
              setEquipmentModalVisible(true);
            }}
          >
            {selectedEquipment ? (
              <Text style={[styles.dropdownButtonText, { color: "white" }]}>
                {selectedEquipment}
              </Text>
            ) : (
              <Text style={styles.dropdownButtonText}>Any Equipment</Text>
            )}
          </Pressable>
        </View>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseRow
              exercise={item}
              onPress={onPress}
              isSelected={
                !!selectedExercises.find((exercise) => exercise.id === item.id)
              }
            />
          )}
        />
      </View>
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
});

export default Exercises;
