import { CircularProgress } from "../customized/progress/progress-10";
import { Card } from "./card";

interface WidgetCard {
  icon: React.ReactNode;
  data: string;
  label: string;
}

export default function WidgetCard({ icon, data, label }: WidgetCard) {
  return (
    <Card className="col-span-3 items-center gap-0 p-0 flex flex-col justify-center rounded-2xl bg-[#FBFDFE] shadow">
      <CircularProgress
        className="stroke-orange-500/25"
        labelClassName="text-xl font-bold"
        progressClassName="stroke-orange-600"
        renderLabel={icon}
        showLabel
        size={120}
        strokeWidth={10}
        value={40}
      />
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl">
          <span>{data}</span>
        </h2>
        <p className="text-xs">{label}</p>
      </div>
    </Card>
  );
}
