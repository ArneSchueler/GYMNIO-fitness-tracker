import { Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { InputField } from "../ui/InputField";
import { TableActions } from "../ui/TableAction";
import { Button } from "../ui/button";

export default function WorkoutInput() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center gap-2">
        <Badge variant="default">
          <p>Sets: </p>
          <p className="text-sm font-bold">3</p>
        </Badge>
        <Badge variant="default">
          <p>Reps: </p>
          <p className="text-sm font-bold">8-12</p>
        </Badge>
        <Badge variant="default">
          <p>Done: </p>
          <div className="text-sm font-bold">
            <span>1</span>/<span>3</span>{" "}
          </div>
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex  border-1 p-2 rounded-xl gap-2">
          <InputField label="Reps" placeholder="Reps" />
          <InputField label="Weight (kg)" placeholder="Weight (kg)" />
        </div>
        <Button className="w-full">
          <Plus />
          Add Set
        </Button>
      </div>
      <div className=" border-1 p-2 rounded-xl">
        <TableActions />
      </div>
    </div>
  );
}
