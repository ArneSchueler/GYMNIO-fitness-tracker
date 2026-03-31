import { Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { InputField } from "../ui/InputField";
import { TableActions } from "../ui/TableAction";
import { Button } from "../ui/button";
import TimerUI from "../ui/TimerUI";

interface WorkoutInputProps {
  sets: number;
  reps: string;
}

export default function WorkoutInput({ sets, reps }: WorkoutInputProps) {
  const cooldown = false;
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
        <Badge variant="default">
          <p>Done: </p>
          <div className="text-sm font-bold">
            <span>0</span>/<span>{sets}</span>{" "}
          </div>
        </Badge>
      </div>
      {!cooldown && (
        <div className="flex flex-col gap-2">
          <div className="flex p-2 rounded-xl gap-2">
            <InputField label="Reps" placeholder="Reps" />
            <InputField label="Weight (kg)" placeholder="Weight (kg)" />
          </div>
          <Button className="w-full">
            <Plus />
            Add Set
          </Button>
        </div>
      )}
      {cooldown && <TimerUI value={90} label="Rest" />}
      <div className=" ">
        <TableActions />
      </div>
    </div>
  );
}
