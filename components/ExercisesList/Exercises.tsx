import { useState, useEffect, useMemo } from "react";
import { Exercise } from "@/types/exercises";
import { StyleSheet, View, Pressable, Text, SectionList } from "react-native";
import ExerciseRow from "@/components/ExerciseRow";
import { EQUIPMENT_FILTERS, MUSCLE_FILTERS } from "@/constants/exerciseFilters";
import CustomTextInput from "../CustomTextInput";
import exercisesStore from "@/store/exercisesStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getExercises,
  getRecentExercises,
  groupExercisesByAlphabet,
} from "@/lib/exercisesService";
import CustomSelect from "../Modals/CustomSelect";
import userStore from "@/store/userStore";
import ExercisesSkeleton from "../Skeletons/ExercisesSkeleton";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";

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
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  useEffect(() => {
    if (exercises.length === 0) fetchExercises();
  }, [exercises]);

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

  if (loading) return <ExercisesSkeleton parentStyles={styles} />;
  return (
    <>
      <View style={styles.container}>
        <CustomTextInput
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Search"
        />
        <View style={styles.pickerContainer}>
          <CustomSelect
            buttonLabel="Any Body Part"
            data={MUSCLE_FILTERS}
            selectedValue={selectedMuscle}
            setSelectedValue={setSelectedMuscle}
            anchor="LEFT"
          />
          <CustomSelect
            buttonLabel="Any Equipment"
            data={EQUIPMENT_FILTERS}
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
                <AntDesign name="caret-up" size={20} color={theme.black} />
              ) : (
                <AntDesign name="caret-down" size={20} color={theme.black} />
              )}
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </Pressable>
          )}
        />
      </View>
    </>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
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
    sectionHeader: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderColor: theme.gray,
      backgroundColor: theme.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    sectionHeaderText: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.textColor,
    },
  });

export default Exercises;
