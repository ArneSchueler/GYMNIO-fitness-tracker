import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: number;
}

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${paddedMinutes}:${paddedSeconds}`
    : `${paddedMinutes}:${paddedSeconds}`;
}

export default function WorkoutHeader({
  workoutName,
  elapsedTime,
}: WorkoutHeaderProps) {
  return (
    <div className="grid w-full grid-cols-6 items-center gap-2">
      <Link to={"/"}>
        <Button variant="outline">
          <Home />
        </Button>
      </Link>
      <div className="col-span-4 flex flex-col items-center gap-0">
        <p className="text-sm text-gray-600 text-center font-medium">
          {workoutName}
        </p>
      </div>
      <p className="text-md font-normal tabular-nums">
        {formatTime(elapsedTime)}
      </p>
    </div>
  );
}
