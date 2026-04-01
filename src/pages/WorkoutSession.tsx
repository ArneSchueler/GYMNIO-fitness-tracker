import WorkoutCard from "@/components/workout/WorkoutCard";
import { useState, useEffect, useRef } from "react";
import { useWorkoutSessionTimer } from "@/hooks/useWorkoutSessionTimer";
import { workoutPlans } from "@/components/workout/workouts";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function WorkoutSession() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentWorkoutIndex] = useState(0); // You can allow this to be changed via routing, params, etc.
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionData, setSessionData] = useState<
    Record<string, { reps: number; weight: number }[]>
  >({});
  const [prevSessionData, setPrevSessionData] = useState<
    Record<string, { reps: number; weight: number }[]>
  >({});
  const { totalSeconds: elapsedTime, stopAndClear } = useWorkoutSessionTimer();
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
          if (wakeLock.current) {
            wakeLock.current.onrelease = () => {
              console.log("Wake Lock was released");
            };
          }
        } catch (err: any) {
          // Fail silently. Wake lock is a nice-to-have, not essential.
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        acquireWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    acquireWakeLock(); // Acquire on initial load

    return () => {
      if (wakeLock.current) {
        wakeLock.current.release();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchPreviousWorkout = async () => {
      try {
        const q = query(
          collection(db, "workout_sessions"),
          where("userId", "==", user.uid),
          where("workoutId", "==", workout.id),
          orderBy("date", "desc"),
          limit(1),
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setPrevSessionData(snap.docs[0].data().exercises || {});
        }
      } catch (error) {
        console.error("Error fetching previous workout:", error);
      }
    };
    fetchPreviousWorkout();
  }, [user, workout.id]);

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

  const handleAddSet = (set: { reps: number; weight: number }) => {
    setSessionData((prev) => ({
      ...prev,
      [currentExercise.id]: [...(prev[currentExercise.id] || []), set],
    }));
  };

  const handleFinish = async () => {
    const finalTime = stopAndClear();
    if (user) {
      try {
        await addDoc(collection(db, "workout_sessions"), {
          userId: user.uid,
          workoutId: workout.id,
          date: Timestamp.now(),
          exercises: sessionData,
          totalTime: finalTime,
        });
      } catch (error) {
        console.error("Error saving workout:", error);
      }
    }
    navigate("/"); // Redirect back to Dashboard
  };

  return (
    <WorkoutCard
      exercise={currentExercise}
      onNext={goToNextExercise}
      onPrevious={goToPreviousExercise}
      onFinish={handleFinish}
      isFirst={currentExerciseIndex === 0}
      isLast={currentExerciseIndex === totalExercises - 1}
      workoutName={workout.title}
      currentPhaseExerciseNumber={currentPhaseExerciseNumber}
      totalPhaseExercises={totalPhaseExercises}
      completedSets={sessionData[currentExercise.id] || []}
      onAddSet={handleAddSet}
      prevSets={prevSessionData[currentExercise.id] || []}
      elapsedTime={elapsedTime}
    />
  );
}
