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
import type { Exercise } from "@/types/workout";

interface WorkoutCardProps {
  exercise: Exercise;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  workoutName: string;
  currentPhaseExerciseNumber: number;
  totalPhaseExercises: number;
}

export default function WorkoutCard({
  exercise,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  workoutName,
  currentPhaseExerciseNumber,
  totalPhaseExercises,
}: WorkoutCardProps) {
  // Card type logic is skipped (no .type defined in the provided Exercise type)
  // We'll adapt here: timer if .duration exists, reps if .sets and .reps exist.
  const isTimerExercise = !!exercise.duration;
  const isRepsExercise = !!exercise.sets && !!exercise.reps;

  return (
    <div className="flex flex-col justify-center items-center h-full py-12">
      <div className="flex flex-col h-full  items-center gap-8 w-full">
        {/* 
          Wrap WorkoutHeader in a div that matches card width on desktop.
          - On mobile: w-full, no max-width constraint.
          - On desktop: match md:max-w-md and md:w-[420px] like the Card.
        */}
        <div className="w-full max-w-sm mx-auto md:max-w-md md:w-[420px]">
          <WorkoutHeader workoutName={workoutName} />
        </div>
        <div className="flex flex-col gap-6 w-full">
          {/* 
            Make ProgressHeader exactly as wide as Card: 
            - On mobile: w-full max-w-sm
            - On desktop: md:max-w-md md:w-[420px]
          */}
          <div className="w-full max-w-sm mx-auto md:max-w-md md:w-[420px]">
            <ProgressHeader
              current={currentPhaseExerciseNumber}
              total={totalPhaseExercises}
              phaseName={exercise.phase}
            />
          </div>
          {/* 
            Card resizing behavior:
              - On mobile: take full width of the screen (w-full, no max-width)
              - On larger screens: limit to max-w-sm 
              - min-h-[420px] (example) keeps the card from shrinking smaller, ensuring consistent height
          */}
          <Card className="flex flex-col gap-6 mx-auto w-full max-w-sm pt-5 md:max-w-md md:w-[420px] min-h-[420px]">
            <CardHeader className="flex flex-col w-full gap-4">
              <img
                src={exercise.image}
                alt={exercise.name}
                className="relative rounded-2xl z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-12">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <CardTitle>{exercise.name}</CardTitle>
                  <CardAction>
                    {exercise.muscleGroups.map((group: string) => (
                      <Badge key={group} variant="secondary">
                        {group}
                      </Badge>
                    ))}
                  </CardAction>
                </div>
                {/* Guard against undefined description */}
                <CardDescription>{exercise.description ?? ""}</CardDescription>
              </div>
              {isTimerExercise && <WorkoutTimer duration={exercise.duration} />}
              {isRepsExercise && (
                <WorkoutInput
                  sets={exercise.sets}
                  reps={exercise.reps}
                  name={exercise.name}
                  phase={exercise.phase}
                />
              )}
            </CardContent>
            <CardFooter className="grid  grid-cols-2 mt-5 gap-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={onPrevious}
                disabled={isFirst}
              >
                <ArrowLeft />
                <span>Previous</span>
              </Button>
              <Button className="w-full" onClick={onNext}>
                <span>{isLast ? "Finish" : "Next"}</span>
                {!isLast && <ArrowRight />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
