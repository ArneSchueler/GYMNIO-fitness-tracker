import WorkoutCard from "@/components/workout/WorkoutCard";
import { useState, useEffect, useRef } from "react";
import { useWorkoutSessionTimer } from "@/hooks/useWorkoutSessionTimer";
import { workoutPlans } from "@/data/workouts";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function WorkoutSession() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // States
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<
    Record<string, { reps: number; weight: number }[]>
  >({});
  const [prevSessionData, setPrevSessionData] = useState<
    Record<string, { reps: number; weight: number }[]>
  >({});

  const { totalSeconds: elapsedTime, stopAndClear } = useWorkoutSessionTimer();
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const workout = workoutPlans.find((w) => w.id === id) || workoutPlans[0];

  /**
   * 1. Session in Firestore initialisieren
   */
  useEffect(() => {
    if (!user || sessionId) return;

    const createInitialSession = async () => {
      try {
        const docRef = await addDoc(collection(db, "workout_sessions"), {
          userId: user.uid,
          workoutId: workout.id,
          date: Timestamp.now(),
          exercises: {}, // Startet leer
          totalTime: 0,
          status: "in-progress",
        });
        setSessionId(docRef.id);
      } catch (error) {
        console.error("Fehler beim Erstellen der Session:", error);
      }
    };

    createInitialSession();
  }, [user, workout.id]);

  /**
   * 2. Sets direkt speichern
   */
  const handleAddSet = async (set: { reps: number; weight: number }) => {
    const exerciseId = workout.exercises[currentExerciseIndex].id;

    // Lokal aktualisieren für das UI
    const updatedSets = [...(sessionData[exerciseId] || []), set];
    setSessionData((prev) => ({
      ...prev,
      [exerciseId]: updatedSets,
    }));

    // In Firestore speichern
    if (sessionId) {
      try {
        const sessionRef = doc(db, "workout_sessions", sessionId);
        await updateDoc(sessionRef, {
          [`exercises.${exerciseId}`]: updatedSets,
        });
      } catch (error) {
        console.error("Fehler beim Speichern des Sets:", error);
      }
    }
  };

  /**
   * 3. Session abschließen
   */
  const handleFinish = async () => {
    const finalTime = stopAndClear();
    if (sessionId) {
      try {
        const sessionRef = doc(db, "workout_sessions", sessionId);
        await updateDoc(sessionRef, {
          totalTime: finalTime,
          status: "completed",
        });
      } catch (error) {
        console.error("Fehler beim Abschließen der Session:", error);
      }
    }
    navigate("/");
  };

  // --- Restliche Logik (WakeLock, PrevSession, Navigation) bleibt gleich ---

  useEffect(() => {
    let isMounted = true;
    const acquireWakeLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          const lock = await navigator.wakeLock.request("screen");
          if (!isMounted) {
            lock.release();
            return;
          }
          wakeLock.current = lock;
        } catch (err) {
          console.warn("Wake Lock failed", err);
        }
      }
    };
    acquireWakeLock();
    return () => {
      isMounted = false;
      wakeLock.current?.release();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchPreviousWorkout = async () => {
      const q = query(
        collection(db, "workout_sessions"),
        where("userId", "==", user.uid),
        where("workoutId", "==", workout.id),
        orderBy("date", "desc"),
        limit(1),
      );
      const snap = await getDocs(q);
      if (!snap.empty) setPrevSessionData(snap.docs[0].data().exercises || {});
    };
    fetchPreviousWorkout();
  }, [user, workout.id]);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const phaseExercises = workout.exercises.filter(
    (ex) => ex.phase === currentExercise.phase,
  );

  return (
    <WorkoutCard
      exercise={currentExercise}
      onNext={() =>
        setCurrentExerciseIndex((prev) =>
          Math.min(prev + 1, workout.exercises.length - 1),
        )
      }
      onPrevious={() =>
        setCurrentExerciseIndex((prev) => Math.max(prev - 1, 0))
      }
      onFinish={handleFinish}
      isFirst={currentExerciseIndex === 0}
      isLast={currentExerciseIndex === workout.exercises.length - 1}
      workoutName={workout.title}
      currentPhaseExerciseNumber={
        phaseExercises.findIndex((ex) => ex.id === currentExercise.id) + 1
      }
      totalPhaseExercises={phaseExercises.length}
      completedSets={sessionData[currentExercise.id] || []}
      onAddSet={handleAddSet}
      prevSets={prevSessionData[currentExercise.id] || []}
      elapsedTime={elapsedTime}
    />
  );
}
