import { Play, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export default function WorkoutTimer() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Progress className="h-2" value={10} />
      <h3 className="text-5xl font-medium ">
        <span>00:45</span>
      </h3>
      <div className="grid w-full grid-cols-6 gap-2">
        <Button variant="default" className="col-span-5">
          <Play />
          <span>Start</span>
        </Button>
        <Button variant="secondary" className="col-span-1 aspect-1">
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
