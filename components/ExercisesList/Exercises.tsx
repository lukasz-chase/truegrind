import { useState, useEffect } from "react";
import { Exercise } from "@/types/exercises";
import { StyleSheet, View, Pressable, Text, SectionList } from "react-native";
import ExerciseRow from "@/components/ExerciseRow";
import { AppColors } from "@/constants/colors";
import { equipmentFilters, muscleFilters } from "@/constants/exerciseFilters";
import CustomTextInput from "../CustomTextInput";
import exercisesStore from "@/store/exercisesStore";
import LoadingAnimation from "../LoadingAnimation";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getExercises,
  getRecentExercises,
  groupExercisesByAlphabet,
} from "@/lib/exercisesService";
import ExerciseFiltersDropdown from "./ExerciseFiltersDropdown";
import userStore from "@/store/userStore";

type Props = {
  onPress: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
};

const Exercises = ({ onPress, selectedExercises }: Props) => {
  const { exercises, setExercises, frequentExercises, recentExercises } =
    exercisesStore();
  const { user } = userStore();

  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    "Recently Used": true,
    "Frequently Used": true,
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
    const filterBoolean = searchQuery || selectedMuscle || selectedEquipment;
    setIsFiltering(!!filterBoolean);
  }, [selectedEquipment, selectedMuscle, searchQuery, exercises]);

  const fetchExercises = async () => {
    setLoading(true);
    if (!user) return;
    const data = await getExercises(user.id);
    if (!data) return;
    const { baseExercises, mostFrequentExercises } = data;
    const mostRecentExercises = await getRecentExercises(user.id);
    setExercises(baseExercises, mostFrequentExercises, mostRecentExercises);
    setFilteredExercises(baseExercises);
    setLoading(false);
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
        <View style={styles.textWrapper}>
          <CustomTextInput
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Search"
          />
        </View>
        <View style={styles.pickerContainer}>
          <ExerciseFiltersDropdown
            buttonLabel="Any Body Part"
            data={muscleFilters}
            selectedValue={selectedMuscle}
            setSelectedValue={setSelectedMuscle}
            anchor="LEFT"
          />
          <ExerciseFiltersDropdown
            buttonLabel="Any Equipment"
            data={equipmentFilters}
            selectedValue={selectedEquipment}
            setSelectedValue={setSelectedEquipment}
            anchor="RIGHT"
          />
        </View>

        <SectionList
          contentContainerStyle={{ paddingBottom: 20 }}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    height: "100%",
  },
  textWrapper: {
    height: 40,
  },
  pickerContainer: {
    marginVertical: 10,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
