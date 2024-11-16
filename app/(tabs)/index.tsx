// StartWorkoutScreen.js
import WorkoutSessionModal from "@/components/WorkoutModal";
import WorkoutPreviewModal from "@/components/WorkoutPreviewModal";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";
import useWorkoutModalStore from "@/store/useWorkoutModalStore";
import useWorkoutPreviewModalStore from "@/store/useWorkoutPreviewModalStore";
import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native-ui-lib";

export default function Workout() {
  const [templates, setTemplates] = useState<any[]>([]);
  const {
    isVisible: isWorkoutModalVisible,
    openModal: openWorkoutModal,
    closeModal: closeWorkoutModal,
  } = useWorkoutModalStore();
  const { isVisible, openModal, closeModal } = useWorkoutPreviewModalStore();
  const [workoutId, setWorkoutId] = useState<number>(0);
  const { session } = userStore((state) => state);
  useEffect(() => {
    fetchTemplates();
  }, [session]);

  const fetchTemplates = async () => {
    try {
      const { data } = await supabase
        .from("workouts")
        .select(`id, name,  workout_exercises(id, exercises(name))`)
        .eq("user_id", session?.user?.id);
      if (data) {
        setTemplates(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <Text style={styles.title}>Start Workout</Text>
        <Button
          label={"Start an Empty Workout"}
          size={Button.sizes.large}
          style={styles.actionButton}
          onPress={openWorkoutModal}
        />
        <View style={styles.templateHeader}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <Button
            label="+ Template"
            size="xSmall"
            style={styles.templatesButton}
          />
        </View>
        <Text>My Templates ({templates.length})</Text>
        <ScrollView style={styles.workouts}>
          {templates.map((template) => (
            <TouchableOpacity
              style={styles.workoutCard}
              key={template.id}
              onPress={() => {
                setWorkoutId(template.id);
                openModal();
              }}
            >
              <Text style={styles.workoutCardTitle}>{template.name}</Text>
              {template?.workout_exercises
                .slice(0, 4)
                .map((workout: { id: number; exercises: { name: string } }) => (
                  <Text
                    key={workout.id}
                    style={styles.workoutCardExercises}
                    numberOfLines={1}
                  >
                    {workout.exercises.name}
                  </Text>
                ))}
              {template?.workout_exercises.length > 4 && (
                <Text style={styles.workoutCardExercises}>
                  & {template.workout_exercises.length - 4} more
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <WorkoutPreviewModal
        visible={isVisible}
        onClose={closeModal}
        workoutId={workoutId}
      />
      <WorkoutSessionModal
        visible={isWorkoutModalVisible}
        onClose={closeWorkoutModal}
        workoutId={workoutId}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: "#25292e",
    paddingVertical: 20,
    fontWeight: "bold",
  },
  actionButton: {
    borderRadius: 10,
    backgroundColor: "#387bce",
  },
  templateHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  templatesTitle: {
    fontSize: 24,
    color: "#25292e",
    fontWeight: "bold",
  },
  templatesButton: {
    backgroundColor: "#387bce",
  },
  workouts: {
    display: "flex",
    marginTop: 20,
  },
  workoutCard: {
    minHeight: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#25292e",
    width: "48%",
    padding: 10,
  },
  workoutCardTitle: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: "bold",
  },
  workoutCardExercises: {
    textOverflow: "ellipsis",
  },
});
