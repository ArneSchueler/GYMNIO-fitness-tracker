import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useRef, useState, useEffect } from "react";
import TimerUI from "../ui/TimerUI";

interface WorkoutTimerProps {
  duration: number;
}

export default function WorkoutTimer({ duration }: WorkoutTimerProps) {
  const INITIAL_TIME = duration;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const lastBeepSecond = useRef<number | null>(null);

  const playTone = (freq: number, duration: number) => {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
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

  // --- DIE PHYSIKALISCHE LOGIK ---

  // 1. Wir runden den internen Wert extrem präzise
  const currentMillis = Math.round(secondsLeft * 10);

  /** * 2. DAS LABEL:
   * Wir wollen:
   * 5.0 bis 4.1 -> Zeige 5
   * 4.0 bis 3.1 -> Zeige 4
   * ...
   * 0.0 -> Zeige 0
   * * Das erreichen wir, indem wir Math.ceil nutzen, aber bei exakten
   * Ganzzahlen (wie 4.0) nicht zulassen, dass er zu früh abrundet.
   */
  let displayValue = Math.ceil(secondsLeft);
  if (secondsLeft > 0 && secondsLeft % 1 === 0) {
    displayValue = secondsLeft;
  }

  useEffect(() => {
    // Sound-Trigger: Wir prüfen auf die "glatte" Millisekunden-Ebene
    // 30 = 3.0s, 20 = 2.0s, 10 = 1.0s, 0 = 0.0s
    if (currentMillis % 10 === 0 && currentMillis !== lastBeepSecond.current) {
      if (currentMillis <= 30 && currentMillis > 0) {
        playTone(880, 0.1);
        lastBeepSecond.current = currentMillis;
      } else if (currentMillis === 0) {
        playTone(440, 0.8);
        lastBeepSecond.current = 0;
      }
    }
  }, [currentMillis]);

  const toggleTimer = () => {
    if (isRunning) {
      if (timerId.current) clearInterval(timerId.current);
      setIsRunning(false);
    } else {
      if (secondsLeft <= 0) return;
      setIsRunning(true);
      timerId.current = setInterval(() => {
        setSecondsLeft((prev) => {
          // Wir ziehen 0.1 ab und fixieren die Floats
          const nextValue = parseFloat((prev - 0.1).toFixed(1));
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
    lastBeepSecond.current = null;
  };

  const percent = (secondsLeft / INITIAL_TIME) * 100;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <TimerUI value={percent} label={displayValue} />

      <div className="grid w-full max-w-[240px] grid-cols-4 gap-2">
        <Button
          variant={isRunning ? "outline" : "default"}
          className="col-span-3 flex gap-2"
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
          onClick={handleReset}
          disabled={secondsLeft === INITIAL_TIME && !isRunning}
        >
          <RotateCcw size={18} />
        </Button>
      </div>
    </div>
  );
}
