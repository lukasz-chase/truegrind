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
import LoadingAnimation from "./LoadingAnimation";
import AntDesign from "@expo/vector-icons/AntDesign";
import { groupExercisesByAlphabet } from "@/lib/helpers";

type Props = {
  onPress: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
};

const Exercises = ({ onPress, selectedExercises }: Props) => {
  const { exercises, setExercises, frequentExercises, recentExercises } =
    exercisesStore();
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [muscleModalVisible, setMuscleModalVisible] = useState(false);
  const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const muscleRef = useRef(null);
  const equipmentRef = useRef(null);

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    "Recently Used": true,
    "Frequently Used": true,
  });

  useEffect(() => {
    getExercises();
  }, []);

  useEffect(() => {
    filterExercises();
    const filterBoolean = searchQuery || selectedMuscle || selectedEquipment;
    setIsFiltering(!!filterBoolean);
  }, [selectedEquipment, selectedMuscle, searchQuery, exercises]);

  const getExercises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("exercises")
      .select("*, exercises_history_count:exercises_history(count)")
      .order("name", { ascending: true })
      .returns<
        (Exercise & {
          exercises_history_count: { count: number }[];
        })[]
      >();

    if (error) {
      console.error("Error fetching exercises:", error);
      return;
    }
    if (!data) return;

    const baseExercises = [...data].map((exercise) => {
      const { exercises_history_count, ...baseExercise } = exercise;
      return baseExercise;
    });

    const mostFrequentExercises = [...data]
      .sort(
        (a, b) =>
          b.exercises_history_count[0].count -
          a.exercises_history_count[0].count
      )
      .slice(0, 5);

    const mostRecentExercises = await getRecentExercises();
    setExercises(baseExercises, mostFrequentExercises, mostRecentExercises);
    setFilteredExercises(baseExercises);
    setLoading(false);
  };

  const getRecentExercises = async () => {
    const { data, error } = await supabase
      .from("exercises_history")
      .select("created_at, exercises!inner(*)")
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<{ created_at: string; exercises: Exercise }[]>();

    if (error) {
      console.error("Error fetching recent exercises:", error);
      return;
    }

    if (data) {
      const mapped = data.map((row) => row.exercises) as Exercise[];
      return mapped;
    }
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

  const sectionsByAlphabet = groupExercisesByAlphabet(filteredExercises);

  const sections = [
    { title: "Recently Used", data: recentExercises },
    { title: "Frequently Used", data: frequentExercises },
    ...sectionsByAlphabet,
  ];

  const collapsibleSections = sections.map((section) => {
    const isCollapsed = collapsedSections[section.title];
    return {
      ...section,
      data: isCollapsed ? [] : section.data,
    };
  });

  return (
    <>
      {loading && <LoadingAnimation />}
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
          sections={collapsibleSections.filter(
            (section) => !(isFiltering && section.title.includes("Used"))
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseRow
              exercise={item}
              onPress={onPress}
              isSelected={!!selectedExercises.find((ex) => ex.id === item.id)}
            />
          )}
          renderSectionHeader={({ section }) => (
            <Pressable
              style={styles.sectionHeader}
              onPress={() => {
                setCollapsedSections((prev) => ({
                  ...prev,
                  [section.title]: !prev[section.title],
                }));
              }}
            >
              {collapsedSections[section.title] ? (
                <AntDesign name="caretright" size={20} color="black" />
              ) : (
                <AntDesign name="caretdown" size={20} color="black" />
              )}
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </Pressable>
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
    backgroundColor: AppColors.lightBlue,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Exercises;
