import WorkoutCard from "@/components/workout/WorkoutCard";
import { useState, useEffect, useRef } from "react";
import type { Workout } from "@/types/workout";

const mockWorkout: Workout = {
  id: "workout-a",
  name: "Workout A - Oberkörper",
  exercises: [
    {
      type: "time",
      name: "Armkreisen",
      description:
        "Kreise deine Arme langsam vorwärts, dann rückwärts. Halte die Bewegung kontrolliert und gleichmäßig.",
      image: "https://avatar.vercel.sh/shadcn1",
      duration: 30, // 30 seconds
      muscleGroups: ["Schultern"],
      phase: "Warmup",
    },
    {
      type: "reps",
      name: "Bankdrücken",
      description: "Langhantel-Bankdrücken für die Brust.",
      image: "https://avatar.vercel.sh/shadcn2",
      sets: 3,
      reps: "8-12",
      muscleGroups: ["Brust", "Trizeps"],
      phase: "Workout",
    },
    {
      type: "time",
      name: "Plank",
      description: "Halte die Unterarmstütz-Position.",
      image: "https://avatar.vercel.sh/shadcn3",
      duration: 60, // 60 seconds
      muscleGroups: ["Core"],
      phase: "Workout",
    },
  ],
};

export default function WorkoutSession() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const acquireWakeLock = async () => {
      // Check if the Screen Wake Lock API is supported by the browser
      if ("wakeLock" in navigator) {
        try {
          wakeLock.current = await navigator.wakeLock.request("screen");
          console.log("Screen Wake Lock is active.");

          // The wake lock is released when the user switches tabs or minimizes the window.
          // We add an event listener to be notified of this.
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

    // Clean up when the component unmounts
    return () => {
      if (wakeLock.current) {
        wakeLock.current.release();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const workout = mockWorkout; // In a real app, this would come from a service or API

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;

  const goToNextExercise = () => {
    setCurrentExerciseIndex((prev) => Math.min(prev + 1, totalExercises - 1));
  };

  const goToPreviousExercise = () => {
    setCurrentExerciseIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <WorkoutCard
      exercise={currentExercise}
      onNext={goToNextExercise}
      onPrevious={goToPreviousExercise}
      isFirst={currentExerciseIndex === 0}
      isLast={currentExerciseIndex === totalExercises - 1}
      workoutName={workout.name}
      currentExerciseNumber={currentExerciseIndex + 1}
      totalExercises={totalExercises}
    />
  );
}
