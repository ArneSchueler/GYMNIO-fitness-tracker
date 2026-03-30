import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WorkoutTimer from "./WorkoutTimer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProgressHeader from "./ProgressHeader";
import WorkoutHeader from "./WorkoutHeader";
import WorkoutInput from "./WorkoutInput";
export default function WorkoutCard() {
  const timer = false;
  const reps = true;

  return (
    <div className="flex flex-col justify-center items-center h-full py-12">
      <div className="flex flex-col h-full justify-between items-center gap-4">
        <WorkoutHeader />
        <div className="flex flex-col gap-6">
          <ProgressHeader></ProgressHeader>
          <Card className="flex flex-col gap-6 mx-auto w-full max-w-sm pt-5 ">
            <CardHeader className="flex flex-col w-full gap-4">
              <img
                src="https://avatar.vercel.sh/shadcn1"
                alt="Event cover"
                className="relative rounded-2xl z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-12">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <CardTitle>Armkreisen</CardTitle>
                  <CardAction>
                    <Badge variant="secondary">Rücken</Badge>
                    <Badge variant="secondary">Knie</Badge>
                  </CardAction>
                </div>
                <CardDescription>
                  Kreise deine Arme langsam vorwärts, dann rückwärts. Halte die
                  Bewegung kontrolliert und gleichmäßig.
                </CardDescription>
              </div>
              {timer && <WorkoutTimer />}
              {reps && <WorkoutInput />}
            </CardContent>
            <CardFooter className="grid  grid-cols-2 mt-5 gap-2">
              <Button variant="ghost" className="w-full">
                <ArrowLeft />
                <span>Previous</span>
              </Button>
              <Button className="w-full">
                <ArrowRight />
                <span>Next</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
