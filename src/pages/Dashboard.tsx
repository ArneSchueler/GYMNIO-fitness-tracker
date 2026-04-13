import { useEffect, useState } from "react";
import { ChartBarDefault } from "@/components/charts/ChartBarDefault";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WidgetCard from "@/components/ui/WidgetCard";
import { Activity, Flame, Footprints, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  // Fallback to "Athlete" if the display name hasn't been set yet
  const userDisplayName = user?.displayName || "Athlete";
  const firstName = userDisplayName.split(" ")[0];

  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString("de-DE", {
    weekday: "long",
  });
  const formattedDate = currentDate.toLocaleDateString("de-DE");

  const widgetIconSize = 44;

  const [stats, setStats] = useState({
    calories: { current: 0, goal: 2480 },
    steps: { current: 0, goal: 10000 },
    heartRate: { current: 0 },
    workoutTime: { current: 0, goal: 60 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log("❌ Dashboard: Kein User eingeloggt.");
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetching the user's synced Fitbit data from Firestore
        console.log(`🔍 Suche Daten für User: ${user.uid}...`);
        const q = query(
          collection(db, "fitbit_daily_stats"),
          where("userId", "==", user.uid),
          orderBy("date", "desc"),
          limit(1),
        );

        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          console.log("✅ Erfolgreich Daten empfangen:", data);
          setIsConnected(true);
          setStats((prev) => ({
            ...prev,
            calories: {
              // Number() wandelt den String "1500" sicher in die Zahl 1500 um
              current: Number(data.calories) || 0,
              goal:
                Number(data.caloriesGoal || data.goals?.calories) ||
                prev.calories.goal,
            },
            steps: {
              current: Number(data.steps) || 0,
              goal:
                Number(data.stepsGoal || data.goals?.steps) || prev.steps.goal,
            },
            heartRate: {
              // Hier nutzen wir auch den Fallback für Kleinschreibung, nur zur Sicherheit
              current: Number(data.heartRate || data.heartrate) || 0,
            },
            workoutTime: {
              current: Number(data.workoutTime || data.activeMinutes) || 0,
              goal:
                Number(data.workoutTimeGoal || data.goals?.activeMinutes) ||
                prev.workoutTime.goal,
            },
          }));
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error("❌ Kritischer Fehler beim Laden der Dashboard-Daten:");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const intervalId = setInterval(fetchDashboardData, 2 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-6 h-full gap-6 flex flex-col min-h-0 text-2xl font-bold">
      <header className="flex justify-between items-center ">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-sky-900">
            Welcome, {firstName}!
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <p className="text-lg text-gray-500">
              {currentDay}, {formattedDate}
            </p>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {isLoading && !isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>{" "}
                  Checking Connection...
                </>
              ) : isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                  Fitbit Connected
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                  Not Connected
                </>
              )}
            </div>
          </div>
        </div>
        <Link to="/workout">
          <Button size={"lg"}>Start Workout</Button>
        </Link>
      </header>
      <main className="grid lg:grid-cols-12 grid-rows-[auto_minmax(250px,1fr)_minmax(250px,1fr)] lg:grid-rows-[auto_minmax(180px,1fr)_minmax(180px,1fr)] gap-4 flex-1 min-h-0">
        <section className="col-span-12 grid lg:grid-cols-12 gap-4">
          <WidgetCard
            icon={<Flame size={widgetIconSize} />}
            data={stats.calories.current}
            goal={stats.calories.goal}
            type="progress"
            label="kcal today"
            isLoading={isLoading}
          ></WidgetCard>
          <WidgetCard
            icon={<Footprints size={widgetIconSize} />}
            data={stats.steps.current}
            goal={stats.steps.goal}
            label="steps"
            type="progress"
            isLoading={isLoading}
          ></WidgetCard>
          <WidgetCard
            icon={<Activity size={widgetIconSize} />}
            data={stats.heartRate.current}
            type="heartrate"
            label="bmp"
            isLoading={isLoading}
          ></WidgetCard>
          <WidgetCard
            icon={<Timer size={widgetIconSize} />}
            data={stats.workoutTime.current}
            goal={stats.workoutTime.goal}
            label="workout minutes"
            type="workout"
            isLoading={isLoading}
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
