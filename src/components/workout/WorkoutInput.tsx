import { Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { InputField } from "../ui/InputField";
import { TableActions } from "../ui/TableAction";
import { Button } from "../ui/button";
import TimerUI from "../ui/TimerUI";
import { useState, useEffect } from "react";

interface WorkoutInputProps {
  sets: number;
  reps: string;
  phase?: string;
  completedSets: { reps: number; weight: number }[];
  onAddSet: (set: { reps: number; weight: number }) => void;
  prevSets?: { reps: number; weight: number }[];
}

export default function WorkoutInput({
  sets,
  reps,
  phase = "main",
  completedSets,
  onAddSet,
  prevSets = [],
}: WorkoutInputProps) {
  const [repsInput, setRepsInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [restTime, setRestTime] = useState(0);

  useEffect(() => {
    if (restTime > 0) {
      const timerId = setTimeout(() => setRestTime((prev) => prev - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [restTime]);

  useEffect(() => {
    if (prevSets && prevSets.length > 0) {
      const correspondingSet =
        prevSets[completedSets.length] || prevSets[prevSets.length - 1];
      if (correspondingSet) {
        setRepsInput((prev) => prev || correspondingSet.reps.toString());
        setWeightInput((prev) => prev || correspondingSet.weight.toString());
      }
    }
  }, [prevSets, completedSets.length]);

  const cooldown = restTime > 0;

  const handleAddSet = () => {
    if (!repsInput || !weightInput) return;
    onAddSet({ reps: Number(repsInput), weight: Number(weightInput) });
    // Setzt das Rep-Feld für das nächste Set zurück
    setRepsInput("");

    if (completedSets.length + 1 < sets) {
      setRestTime(90); // 90 Sekunden Pause starten
    }
  };

  const isMainPhase = phase === "main";

  return (
    <div className="flex  flex-col border p-2 rounded-xl gap-4">
      <div className="flex  justify-center gap-2">
        <Badge variant="default">
          <p>Sets: </p>
          <p className="text-sm font-bold">{sets}</p>
        </Badge>
        <Badge variant="default">
          <p>Reps: </p>
          <p className="text-sm font-bold">{reps}</p>
        </Badge>
        {isMainPhase && (
          <Badge variant="default">
            <p>Done: </p>
            <div className="text-sm font-bold">
              <span>{completedSets.length}</span>/<span>{sets}</span>{" "}
            </div>
          </Badge>
        )}
      </div>
      {isMainPhase && completedSets.length < sets && !cooldown && (
        <div className="flex flex-col gap-2">
          <div className="flex p-2 rounded-xl gap-2">
            <InputField
              label="Reps"
              placeholder="Reps"
              type="number"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
            />
            <InputField
              label="Weight (kg)"
              placeholder="Weight (kg)"
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleAddSet}>
            <Plus />
            Add Set
          </Button>
        </div>
      )}
      {isMainPhase && cooldown && (
        <div className="flex flex-col items-center gap-2">
          <TimerUI value={(restTime / 90) * 100} label={restTime} />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setRestTime(0)}
          >
            Skip Rest
          </Button>
        </div>
      )}
      {isMainPhase && (
        <div className="flex flex-col gap-2 mt-2">
          {prevSets && prevSets.length > 0 && (
            <div
              className="opacity-70 bg-gray-50 dark:bg-slate-800/50 rounded-md p-3 flex justify-between items-center text-sm border border-dashed border-gray-300 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => {
                const lastSet = prevSets[prevSets.length - 1];
                setRepsInput(lastSet.reps.toString());
                setWeightInput(lastSet.weight.toString());
              }}
              title="Click to copy previous values"
            >
              <span className="font-semibold text-gray-500 uppercase tracking-wider text-xs">
                Prev
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {prevSets[prevSets.length - 1].reps} Reps
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {prevSets[prevSets.length - 1].weight} kg
              </span>
            </div>
          )}
          <TableActions sets={completedSets} prevSets={prevSets} />
        </div>
      )}
    </div>
  );
}
