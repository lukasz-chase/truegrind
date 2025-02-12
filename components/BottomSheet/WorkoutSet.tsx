import { View, StyleSheet } from "react-native";
import Animated, {
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import useActiveWorkout from "@/store/useActiveWorkout";
import { ExerciseSet } from "@/types/exercisesSets";
import CompleteSetButton from "./CompleteSetButton";
import userStore from "@/store/userStore";
import SetHistory from "./SetHistory";
import SetInput from "./SetInput";
import SetOrder from "./SetOrder";
import SwipeToDelete from "@/components/SwipeToDelete";
import { AppColors } from "@/constants/colors";

type Props = {
  exerciseSet: ExerciseSet;
  exerciseId: string;
  exerciseTimer: number | null;
  warmupTimer: number | null;
};

const WorkoutSet = ({
  exerciseSet,
  exerciseId,
  exerciseTimer,
  warmupTimer,
}: Props) => {
  const rowScale = useSharedValue(1);

  const { updateExerciseSet, deleteExerciseSet } = useActiveWorkout();
  const { user } = userStore();

  const updateSet = (newValue: any, name: keyof ExerciseSet) => {
    updateExerciseSetFields({ [name]: newValue });
  };

  const bulkUpdateSet = (newValue: Partial<ExerciseSet>) => {
    updateExerciseSet(exerciseId, exerciseSet.id, { ...newValue });
  };

  const updateExerciseSetFields = (newValues: Partial<ExerciseSet>) => {
    updateExerciseSet(exerciseId, exerciseSet.id, newValues);
  };

  const handleDelete = () => {
    deleteExerciseSet(exerciseId, exerciseSet.id);
  };
  return (
    <SwipeToDelete onDelete={handleDelete}>
      <Animated.View
        style={[
          styles.row,
          {
            backgroundColor: exerciseSet.completed
              ? AppColors.lightGreen
              : "white",
          },
        ]}
      >
        <View style={[styles.cell, { flex: 0.75 }]}>
          <SetOrder
            isCompleted={exerciseSet.completed}
            order={exerciseSet.order}
            isWarmup={exerciseSet.is_warmup}
            isDropset={exerciseSet.is_dropset}
            exerciseId={exerciseId}
            exerciseSetId={exerciseSet.id}
          />
        </View>
        <View style={[styles.cell, { flex: 1.75 }]}>
          <SetHistory
            exerciseId={exerciseId}
            setOrder={exerciseSet.order}
            userId={user?.id!}
            bulkUpdateSet={bulkUpdateSet}
          />
        </View>
        <View style={[styles.cell, { flex: 1.25 }]}>
          <SetInput
            value={exerciseSet.weight}
            completed={exerciseSet.completed}
            exerciseSetId={exerciseSet.id}
            updateSet={updateSet}
            fieldName="weight"
            updateStoreSetField={updateExerciseSetFields}
            localStateRpeValue={exerciseSet.rpe}
            localStatePartialsValue={exerciseSet.partials}
          />
        </View>

        <View style={[styles.cell, { flex: 1.25 }]}>
          <SetInput
            value={exerciseSet.reps}
            completed={exerciseSet.completed}
            exerciseSetId={exerciseSet.id}
            updateSet={updateSet}
            fieldName="reps"
            updateStoreSetField={updateExerciseSetFields}
            localStateRpeValue={exerciseSet.rpe}
            localStatePartialsValue={exerciseSet.partials}
          />
        </View>
        <View style={[styles.cell, { flex: 1, alignItems: "center" }]}>
          <CompleteSetButton
            updateStoreSetField={updateExerciseSetFields}
            completed={exerciseSet.completed}
            reps={exerciseSet.reps}
            rowScale={rowScale}
            exerciseTimer={exerciseTimer}
            weight={exerciseSet.weight}
            isWarmup={exerciseSet.is_warmup}
            warmupTimer={warmupTimer}
          />
        </View>
      </Animated.View>
    </SwipeToDelete>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  cell: {
    paddingVertical: 10,
    textAlign: "center",
    justifyContent: "center",
  },
});

export default WorkoutSet;
