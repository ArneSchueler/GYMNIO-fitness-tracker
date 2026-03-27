import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function WorkoutHeader() {
  return (
    <div className="grid w-full grid-cols-6 items-center gap-2">
      <Link to={"/"}>
        <Button variant="outline">
          <Home />
        </Button>
      </Link>
      <div className="col-span-4 flex flex-col items-center gap-0">
        <p className="text-sm text-gray-600 font-medium">
          Workout A - Oberkörper
        </p>
        <p className="text-md font-semibold">Warmup</p>
      </div>
      <p className="text-md font-normal">00:45</p>
    </div>
  );
}
