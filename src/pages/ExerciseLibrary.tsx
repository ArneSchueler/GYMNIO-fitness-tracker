import { useState, useEffect, useMemo } from "react";
import { workoutPlans, type WorkoutPlan, type Exercise } from "@/data/workouts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreVertical, X } from "lucide-react";
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

export default function ExerciseLibrary() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>(workoutPlans);
  const [lastSessions, setLastSessions] = useState<Record<string, any>>({});

  // Search and Filter state for Exercise Database
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleFilters, setMuscleFilters] = useState<string[]>([]);
  const [muscleSearchTerm, setMuscleSearchTerm] = useState("");

  // Extract and deduplicate all exercises from workouts
  const allExercises = useMemo(() => {
    const exercises = workouts.flatMap((plan) => plan.exercises);
    const unique: Exercise[] = [];
    const seen = new Set<string>();
    for (const ex of exercises) {
      if (!seen.has(ex.name)) {
        seen.add(ex.name);
        unique.push(ex);
      }
    }
    return unique;
  }, [workouts]);

  // Get all unique muscle groups for filter dropdown
  const allMuscleGroups = useMemo(() => {
    const groups = new Set<string>();
    allExercises.forEach((ex) => {
      ex.muscleGroups.forEach((mg) => groups.add(mg));
    });
    return Array.from(groups).sort();
  }, [allExercises]);

  // Filter exercises based on search and filter
  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.muscleGroups.some((mg) =>
          mg.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesMuscle =
        muscleFilters.length === 0 ||
        muscleFilters.some((filter) => ex.muscleGroups.includes(filter));
      return matchesSearch && matchesMuscle;
    });
  }, [allExercises, searchTerm, muscleFilters]);

  // Pagination state for Exercise Database
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 6;
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);
  const currentExercises = filteredExercises.slice(
    (currentPage - 1) * exercisesPerPage,
    currentPage * exercisesPerPage,
  );

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, muscleFilters]);

  useEffect(() => {
    if (!user) return;
    const fetchLastSessions = async () => {
      const sessions: Record<string, any> = {};
      for (const workout of workouts) {
        const q = query(
          collection(db, "workout_sessions"),
          where("userId", "==", user.uid),
          where("workoutId", "==", workout.id),
          orderBy("date", "desc"),
          limit(1),
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          sessions[workout.id] = snap.docs[0].data();
        }
      }
      setLastSessions(sessions);
    };
    fetchLastSessions();
  }, [user, workouts]);

  const handleDelete = (id: string) => {
    // In a real app, you would delete this from your backend/database as well
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleEdit = (id: string) => {
    // Placeholder: wire this up to open an edit modal or navigate to an edit page
    console.log("Edit workout:", id);
    alert("Edit functionality coming soon!");
  };

  const handleCreate = () => {
    // Placeholder: wire this up to open a create modal or navigate to a builder page
    console.log("Create new workout");
    alert("Create functionality coming soon!");
  };

  // Helper to extract all unique muscle groups targeted in a workout
  const getUniqueMuscleGroups = (plan: WorkoutPlan) => {
    const groups = new Set<string>();
    plan.exercises.forEach((ex) => {
      ex.muscleGroups.forEach((mg) => groups.add(mg));
    });
    return Array.from(groups);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExerciseDisplay = (workoutId: string, ex: Exercise) => {
    const session = lastSessions[workoutId];
    if (session?.exercises?.[ex.id]?.length) {
      const sets = session.exercises[ex.id];
      const bestSet = sets.reduce(
        (prev: any, curr: any) => (curr.weight > prev.weight ? curr : prev),
        sets[0],
      );
      return `${sets.length}x${bestSet.reps} ${bestSet.weight ? `• ${bestSet.weight} kg` : ""}`;
    }
    return `${ex.reps || "-"} ${ex.weight ? `• ${ex.weight}` : ""}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-800">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Workout Library</h1>
        <Button onClick={handleCreate} className="shadow-sm">
          + Create New Workout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts.map((workout) => {
          return (
            <Card
              key={workout.id}
              className="flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row justify-between items-start">
                <div className="pr-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {workout.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500 font-medium mt-1.5">
                    Last Performed:{" "}
                    {lastSessions[workout.id]
                      ? formatDate(lastSessions[workout.id].date)
                      : "Never"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 shrink-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(workout.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(workout.id)}
                      className="text-red-600 focus:bg-red-50 focus:text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Target Muscle Groups
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {getUniqueMuscleGroups(workout).map((group) => (
                      <Badge key={group} variant="secondary">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">
                    Main Exercises
                  </p>
                  <ul className="space-y-2">
                    {workout.exercises
                      .filter((ex) => ex.phase === "main")
                      .map((ex) => (
                        <li
                          key={ex.id}
                          className="text-sm flex justify-between bg-gray-50 px-3 py-2 rounded-md items-center"
                        >
                          <span className="truncate pr-2 font-medium text-gray-700">
                            {ex.name}
                          </span>
                          <span className="text-gray-500 flex-shrink-0 text-xs font-semibold">
                            {getExerciseDisplay(workout.id, ex)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="pt-4 mt-auto">
                <Link to={`/workout/${workout.id}`} className="w-full">
                  <Button className="w-full">Start Workout</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* New Exercise Database Section */}
      <div className="mt-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Exercise Database</h2>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <Input
              id="search-exercises"
              placeholder="Search by name or muscle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[220px] justify-start text-left font-normal"
                >
                  Filter by Muscle
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px]">
                <div className="p-2">
                  <Input
                    placeholder="Search muscles..."
                    value={muscleSearchTerm}
                    onChange={(e) => setMuscleSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()} // Keep menu open when typing space/arrows
                    className="h-8 text-sm"
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {allMuscleGroups
                    .filter((g) =>
                      g.toLowerCase().includes(muscleSearchTerm.toLowerCase()),
                    )
                    .map((group) => (
                      <DropdownMenuCheckboxItem
                        key={group}
                        checked={muscleFilters.includes(group)}
                        onCheckedChange={(checked) => {
                          setMuscleFilters((prev) =>
                            checked
                              ? [...prev, group]
                              : prev.filter((g) => g !== group),
                          );
                        }}
                        onSelect={(e) => e.preventDefault()} // Keeps the menu open on click
                      >
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  {allMuscleGroups.filter((g) =>
                    g.toLowerCase().includes(muscleSearchTerm.toLowerCase()),
                  ).length === 0 && (
                    <p className="text-sm text-center text-gray-500 py-2">
                      No muscles found.
                    </p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Selected Filters Badges */}
          {muscleFilters.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-2">
              {muscleFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="flex items-center gap-1 text-sm py-1 px-3"
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <button
                    onClick={() =>
                      setMuscleFilters((prev) =>
                        prev.filter((f) => f !== filter),
                      )
                    }
                    className="hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove filter</span>
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMuscleFilters([])}
                className="h-7 text-xs text-gray-500 hover:text-gray-700 ml-1"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              <p>No exercises found.</p>
            </div>
          )}
          {currentExercises.map((ex) => (
            <Card
              key={ex.id}
              className="flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden"
            >
              {ex.image && (
                <div className="h-40 bg-gray-50 flex items-center justify-center p-2">
                  <img
                    src={ex.image}
                    alt={ex.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-lg font-bold leading-tight">
                    {ex.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {ex.muscleGroups.map((mg) => (
                      <Badge key={mg} variant="secondary">
                        {mg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                {ex.notes && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {ex.notes}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    alert("Add to workout functionality coming soon!")
                  }
                >
                  Add to Workout
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredExercises.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
