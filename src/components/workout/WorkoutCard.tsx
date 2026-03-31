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
  currentExerciseNumber: number;
  totalExercises: number;
}

export default function WorkoutCard({
  exercise,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  workoutName,
  currentExerciseNumber,
  totalExercises,
}: WorkoutCardProps) {
  const isTimerExercise = exercise.type === "time";
  const isRepsExercise = exercise.type === "reps";

  return (
    <div className="flex flex-col justify-center items-center h-full py-12">
      <div className="flex flex-col h-full justify-between items-center gap-4">
        <WorkoutHeader
          workoutName={workoutName}
          exerciseCategory={exercise.phase}
        />
        <div className="flex flex-col gap-6">
          <ProgressHeader
            current={currentExerciseNumber}
            total={totalExercises}
            phaseName={exercise.phase}
          />
          <Card className="flex flex-col gap-6 mx-auto w-full max-w-sm pt-5 ">
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
                    {exercise.muscleGroups.map((group) => (
                      <Badge key={group} variant="secondary">
                        {group}
                      </Badge>
                    ))}
                  </CardAction>
                </div>
                <CardDescription>{exercise.description}</CardDescription>
              </div>
              {isTimerExercise && <WorkoutTimer duration={exercise.duration} />}
              {isRepsExercise && (
                <WorkoutInput sets={exercise.sets} reps={exercise.reps} />
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
