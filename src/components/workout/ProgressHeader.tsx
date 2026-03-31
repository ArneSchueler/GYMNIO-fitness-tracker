import { Progress } from "../ui/progress";

interface ProgressHeaderProps {
  current: number;
  total: number;
  phaseName: string;
}

export default function ProgressHeader({
  current,
  total,
  phaseName,
}: ProgressHeaderProps) {
  const progressValue = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex w-full justify-between px-1">
        <div className="text-sm text-gray-600 font-medium">
          <span>{current}</span> / <span>{total}</span>
        </div>
        <p className="text-sm text-gray-600 font-medium">{phaseName}</p>
      </div>
      <Progress value={progressValue} />
    </div>
  );
}
