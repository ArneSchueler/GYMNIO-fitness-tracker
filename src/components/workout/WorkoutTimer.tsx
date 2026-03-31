import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useRef, useState, useEffect } from "react";
import TimerUI from "../ui/TimerUI";

const INITIAL_TIME = 5;

export default function WorkoutTimer() {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // --- Audio Logik ---
  const playTone = (freq: number, duration: number) => {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine"; // "sine", "square", "sawtooth", "triangle"
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Lautstärke-Kurve (verhindert Knacken am Ende)
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + duration,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  };

  const displaySeconds = Math.ceil(secondsLeft);

  useEffect(() => {
    if (!isRunning) return;
    if (displaySeconds <= 3 && displaySeconds > 0) {
      playTone(880, 0.1);
    } else if (displaySeconds === 0) {
      playTone(440, 0.8);
    }
  }, [displaySeconds, isRunning]);

  // --- NEU: Toggle Logik für Start/Pause ---
  const toggleTimer = () => {
    if (isRunning) {
      // PAUSE: Intervall stoppen, aber Zeit behalten
      if (timerId.current) clearInterval(timerId.current);
      setIsRunning(false);
    } else {
      // START/RESUME: Nur starten, wenn noch Zeit übrig ist
      if (secondsLeft <= 0) return;
      setIsRunning(true);

      timerId.current = setInterval(() => {
        setSecondsLeft((prev) => {
          const nextValue = prev - 0.1;
          if (nextValue <= 0) {
            if (timerId.current) clearInterval(timerId.current);
            setIsRunning(false);
            return 0;
          }
          return nextValue;
        });
      }, 100);
    }
  };

  const handleReset = () => {
    if (timerId.current) clearInterval(timerId.current);
    setIsRunning(false);
    setSecondsLeft(INITIAL_TIME);
  };

  // Cleanup bei Unmount
  useEffect(() => {
    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, []);

  const percent = (secondsLeft / INITIAL_TIME) * 100;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <TimerUI value={percent} label={displaySeconds} />

      <div className="grid w-full max-w-[240px] grid-cols-4 gap-2">
        {/* Dynamischer Button: Wechselt zwischen Start und Pause */}
        <Button
          variant={isRunning ? "outline" : "default"} // Optisches Feedback bei Pause
          className="col-span-3 flex gap-2 transition-all"
          onClick={toggleTimer}
          disabled={secondsLeft === 0}
        >
          {isRunning ? (
            <>
              <Pause size={18} fill="currentColor" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              <span>{secondsLeft === INITIAL_TIME ? "Start" : "Weiter"}</span>
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          className="col-span-1"
          onClick={handleReset}
          disabled={secondsLeft === INITIAL_TIME && !isRunning}
        >
          <RotateCcw size={18} />
        </Button>
      </div>
    </div>
  );
}
