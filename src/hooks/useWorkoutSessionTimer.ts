import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "gymnio_workout_elapsed_time";

export function useWorkoutSessionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const secondsRef = useRef(seconds);
  secondsRef.current = seconds;

  useEffect(() => {
    // 1. Load existing progress from localStorage
    const savedTime = localStorage.getItem(STORAGE_KEY);
    if (savedTime) {
      const parsedTime = parseInt(savedTime, 10);
      if (!isNaN(parsedTime)) {
        setSeconds(parsedTime);
      }
    }
  }, []); // Load only once on mount

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Handle visibility change to pause/resume timer and save on unmount
  useEffect(() => {
    const handleVisibilityChange = () =>
      setIsActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      localStorage.setItem(STORAGE_KEY, String(secondsRef.current));
    };
  }, []); // Effect runs only once

  const stopAndClear = () => {
    setIsActive(false);
    const finalTime = secondsRef.current;
    localStorage.removeItem(STORAGE_KEY); // Clear for next workout
    return finalTime;
  };

  return { totalSeconds: seconds, stopAndClear };
}
