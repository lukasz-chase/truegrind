export interface MetricsData {
  history: WorkoutMetrics[];
  oneRMRecord: OneRMRecord | null;
  weightRecord: WeightRecord | null;
  volumeRecord: VolumeRecord | null;
}

export interface WorkoutMetrics {
  id: string;
  workoutName: string;
  workoutDate: string;
  exercisesMetrics: ExerciseMetric[];
  highestOneRepMax: OneRMRecord; // { value: number; date: string }
  highestWeightSet: {
    weight: number;
    reps: number;
  };
  highestVolumeSet: {
    weight: number;
    reps: number;
    totalVolume: number;
  };
  maxConsecutiveReps: number;
}

export interface ExerciseMetric {
  exerciseId: string;
  setsMetrics: SetMetric[];
}

export interface SetMetric {
  id: string;
  rpe: number;
  reps: number;
  order: number;
  weight: number;
  user_id: string;
  partials: number;
  completed: boolean;
  is_warmup: boolean;
  created_at: string;
  is_dropset: boolean;
  exercise_id: string;
  workout_exercise_id: string;
  oneRepMax: number;
  totalVolume: number;
}

// Common record types for 1RM, weight, volume, etc.
export interface OneRMRecord {
  value: number;
  date: string;
}

export interface WeightRecord {
  weight: number;
  reps: number;
  date: string;
}

export interface VolumeRecord {
  weight: number;
  reps: number;
  totalVolume: number;
  date: string;
}
