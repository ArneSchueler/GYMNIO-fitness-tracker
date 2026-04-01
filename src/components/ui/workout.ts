export interface ExerciseSet {
  reps: number;
  weight: number;
}

export interface BaseExercise {
  name: string;
  description: string;
  image: string;
  muscleGroups: string[];
  phase: string; // e.g. "Warmup", "Workout", "Cooldown"
}

export interface TimedExercise extends BaseExercise {
  type: "time";
  duration: number; // in seconds
}

export interface RepsExercise extends BaseExercise {
  type: "reps";
  sets: number;
  reps: string; // e.g., "8-12"
}

export type Exercise = TimedExercise | RepsExercise;

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}
