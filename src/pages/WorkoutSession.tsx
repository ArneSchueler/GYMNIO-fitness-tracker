import WorkoutCard from "@/components/workout/WorkoutCard";
import { useState, useEffect, useRef } from "react";
import { workoutPlans } from "@/components/workout/workouts";

export default function WorkoutSession() {
  const [currentWorkoutIndex] = useState(0); // You can allow this to be changed via routing, params, etc.
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  // Select the workout you want to show: here hardcoded to the first one
  const workout = workoutPlans[currentWorkoutIndex];

  useEffect(() => {
    const acquireWakeLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          wakeLock.current = await (navigator as any).wakeLock.request(
            "screen",
          );
          console.log("Screen Wake Lock is active.");
          wakeLock.current.onrelease = () => {
            console.log("Screen Wake Lock was released.");
            wakeLock.current = null;
          };
        } catch (err: any) {
          console.error(
            `Failed to acquire screen wake lock: ${err.name}, ${err.message}`,
          );
        }
      }
    };

    acquireWakeLock();

    const handleVisibilityChange = () => {
      if (wakeLock.current === null && document.visibilityState === "visible") {
        acquireWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (wakeLock.current) {
        wakeLock.current.release();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const currentExercise = workout.exercises[currentExerciseIndex];
  // Calculate how many exercises in the *current phase* (e.g., warm-up, main, cool-down) of the current exercise
  const currentPhase = currentExercise.phase;
  const phaseExercises = workout.exercises.filter(
    (exercise) => exercise.phase === currentPhase,
  );
  const totalExercises = workout.exercises.length;
  const totalPhaseExercises = phaseExercises.length;
  const currentPhaseExerciseNumber =
    phaseExercises.findIndex((exercise) => exercise.id === currentExercise.id) +
    1;

  const goToNextExercise = () => {
    setCurrentExerciseIndex((previousIndex) =>
      Math.min(previousIndex + 1, totalExercises - 1),
    );
  };

  const goToPreviousExercise = () => {
    setCurrentExerciseIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  return (
    <WorkoutCard
      exercise={currentExercise}
      onNext={goToNextExercise}
      onPrevious={goToPreviousExercise}
      isFirst={currentExerciseIndex === 0}
      isLast={currentExerciseIndex === totalExercises - 1}
      workoutName={workout.title}
      currentPhaseExerciseNumber={currentPhaseExerciseNumber}
      totalPhaseExercises={totalPhaseExercises}
    />
  );
}
