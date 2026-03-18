import { ChartBarDefault } from "@/components/charts/ChartBarDefault";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WidgetCard from "@/components/ui/WidgetCard";
import { Activity, Flame, Footprints, Timer } from "lucide-react";

export default function Dashboard() {
  const username = "John";
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString("de-DE", {
    weekday: "long",
  });
  const formattedDate = currentDate.toLocaleDateString("de-DE");

  const widgetIconSize = 44;

  const stats = {
    calories: { current: 1300, goal: 2480 },
    steps: { current: 8430, goal: 10000 },
    heartRate: { current: 72 },
    workoutTime: { current: 45, goal: 60 },
  };

  return (
    <div className="p-8 h-full gap-8 flex flex-col overflow-hidden text-2xl font-bold">
      <header className="flex justify-between items-center ">
        <div>
          <h1 className="text-5xl text-sky-900">Welcome, {username}!</h1>
          <p className="text-lg text-gray-500">
            {currentDay}, {formattedDate}
          </p>
        </div>
        <Button size={"lg"}>Start Workout</Button>
      </header>
      <main className="grid lg:grid-cols-12 grid-rows-[auto_minmax(250px,1fr)_minmax(250px,1fr)] gap-4 flex-1 min-h-0">
        <section className="col-span-12 grid lg:grid-cols-12 gap-4">
          <WidgetCard
            icon={<Flame size={widgetIconSize} />}
            data={stats.calories.current}
            goal={stats.calories.goal}
            type="progress"
            label="kcal today"
          ></WidgetCard>
          <WidgetCard
            icon={<Footprints size={widgetIconSize} />}
            data={stats.steps.current}
            goal={stats.steps.goal}
            label="steps"
            type="progress"
          ></WidgetCard>
          <WidgetCard
            icon={<Activity size={widgetIconSize} />}
            data={stats.heartRate.current}
            type="heartrate"
            label="bmp"
          ></WidgetCard>
          <WidgetCard
            icon={<Timer size={widgetIconSize} />}
            data={stats.workoutTime.current}
            goal={stats.workoutTime.goal}
            label="workout minutes"
            type="workout"
          ></WidgetCard>
        </section>
        <section className="col-span-12 grid lg:grid-cols-12 gap-4 min-h-0">
          <ChartBarDefault widgetWidth="4"></ChartBarDefault>
          <Card className="col-span-4 gap-6 flex flex-col justify-center rounded-2xl bg-[#FBFDFE] shadow">
            <h3>Fun Fact</h3>
            <p className="text-sm font-regular">
              Compound exercises like squats and deadlifts work multiple muscle
              groups at once – saving you time and boosting results!
            </p>
          </Card>
          <Card className="col-span-4 gap-6 flex flex-col justify-center rounded-2xl bg-[#FBFDFE] shadow">
            <h3>Fun Fact</h3>
            <p className="text-sm font-regular">
              Compound exercises like squats and deadlifts work multiple muscle
              groups at once – saving you time and boosting results!
            </p>
          </Card>
        </section>
        <section className="col-span-12 grid grid-cols-12 gap-4 min-h-0">
          <Card className="col-span-3 gap-6 flex flex-col justify-center rounded-2xl bg-[#FBFDFE] shadow">
            <h3>Fun Fact</h3>
            <p className="text-sm font-regular">
              Compound exercises like squats and deadlifts work multiple muscle
              groups at once – saving you time and boosting results!
            </p>
          </Card>
          <Card className="col-span-3 gap-6 flex flex-col justify-center rounded-2xl bg-[#FBFDFE] shadow">
            <h3>Fun Fact</h3>
            <p className="text-sm font-regular">
              Compound exercises like squats and deadlifts work multiple muscle
              groups at once – saving you time and boosting results!
            </p>
          </Card>
        </section>
      </main>
    </div>
  );
}
