import { Progress } from "../ui/progress";

export default function ProgressHeader() {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex w-full justify-between px-1">
        <div className="text-sm text-gray-600 font-medium">
          <span>1</span> / <span>10</span>
        </div>
        <p className="text-sm text-gray-600 font-medium">Warmup</p>
      </div>
      <Progress value={10} />
    </div>
  );
}
