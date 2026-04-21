import { useEffect, useState } from "react";
import { ChartBarDefault } from "@/components/charts/ChartBarDefault";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WidgetCard from "@/components/ui/WidgetCard";
import { Activity, Flame, Footprints, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { workoutPlans, WorkoutPlan } from "@/data/workouts";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
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
  const [lastUsedWorkoutId, setLastUsedWorkoutId] = useState<string | null>(
    null,
  );
  const [allWorkouts, setAllWorkouts] = useState<WorkoutPlan[]>(workoutPlans);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "fitbit_daily_stats"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
      limit(1),
    );

    // Echtzeit-Listener
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setStats((prev) => ({
          ...prev,
          calories: { ...prev.calories, current: Number(data.calories) || 0 },
          steps: { ...prev.steps, current: Number(data.steps) || 0 },
          heartRate: { current: Number(data.heartRate || data.heartrate) || 0 },
          workoutTime: {
            ...prev.workoutTime,
            current: Number(data.workoutTime) || 0,
          },
        }));
        setIsConnected(true);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch the last used workout session
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      // Fetch last used
      const lastSessionQuery = query(
        collection(db, "workout_sessions"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(1),
      );
      // Fetch custom workouts
      const customWorkoutsQuery = query(
        collection(db, "workouts"),
        where("userId", "==", user.uid),
      );

      const [sessionSnap, customSnap] = await Promise.all([
        getDocs(lastSessionQuery),
        getDocs(customWorkoutsQuery),
      ]);
      if (!sessionSnap.empty) {
        setLastUsedWorkoutId(sessionSnap.docs[0].data().workoutId);
      }
      const customWorkouts = customSnap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as WorkoutPlan,
      );
      setAllWorkouts([...workoutPlans, ...customWorkouts]);
    };
    fetchUserData();
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
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"lg"}>Start Workout</Button>
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-slate-950 p-6 shadow-lg sm:max-w-[425px] sm:rounded-xl border border-gray-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle>Select a Workout</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-2">
              {allWorkouts.map((plan) => (
                <Link
                  key={plan.id}
                  to={`/workout/${plan.id}`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3 px-4 flex items-center gap-2"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-semibold text-base whitespace-normal text-left leading-tight text-sky-900 dark:text-sky-100">
                        {plan.title}
                      </span>
                      <span className="text-xs text-gray-500 font-normal">
                        {plan.exercises.length} Exercises
                      </span>
                    </div>
                    {lastUsedWorkoutId === plan.id && (
                      <span className="text-[10px] font-medium bg-sky-100 text-sky-700 px-2.5 py-0.5 rounded-full dark:bg-sky-900 dark:text-sky-100 whitespace-nowrap shrink-0">
                        Last Used
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-950 px-2 text-gray-500">
                    Or
                  </span>
                </div>
              </div>
              <Link to="/exercises" className="w-full">
                <Button variant="secondary" className="w-full font-semibold">
                  + Create New Workout
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
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
