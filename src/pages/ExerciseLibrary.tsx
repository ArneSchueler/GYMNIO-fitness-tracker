import { useState, useEffect, useMemo } from "react";
import { workoutPlans, type WorkoutPlan, type Exercise } from "@/data/workouts";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
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
import { MoreVertical, X, GripVertical } from "lucide-react";
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
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ExerciseLibrary() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>(workoutPlans);
  const [lastSessions, setLastSessions] = useState<Record<string, any>>({});

  // Create Workout state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [warmupExercises, setWarmupExercises] = useState<string[]>([]);
  const [mainExercises, setMainExercises] = useState<string[]>([]);
  const [cooldownExercises, setCooldownExercises] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // State for dialog search/filter
  const [dialogSearchTerm, setDialogSearchTerm] = useState("");
  const [dialogMuscleFilters, setDialogMuscleFilters] = useState<string[]>([]);

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
      ex.muscleGroups?.forEach((mg) => groups.add(mg));
    });
    return Array.from(groups).sort();
  }, [allExercises]);

  // Filter exercises based on search and filter
  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.muscleGroups || []).some((mg) =>
          mg.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesMuscle =
        muscleFilters.length === 0 ||
        muscleFilters.some((filter) =>
          (ex.muscleGroups || []).includes(filter),
        );
      return matchesSearch && matchesMuscle;
    });
  }, [allExercises, searchTerm, muscleFilters]);

  // Filter exercises for the create/edit dialog
  const filteredDialogExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const nameMatch = ex.name
        .toLowerCase()
        .includes(dialogSearchTerm.toLowerCase());
      const muscleMatch =
        dialogMuscleFilters.length === 0 ||
        dialogMuscleFilters.some((filter) =>
          (ex.muscleGroups || []).includes(filter),
        );
      return nameMatch && muscleMatch;
    });
  }, [allExercises, dialogSearchTerm, dialogMuscleFilters]);

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
      try {
        const q = query(
          collection(db, "workout_sessions"),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        const allSessions = snap.docs.map((doc) => doc.data());

        allSessions.sort((a, b) => {
          const timeA = a.date?.toMillis
            ? a.date.toMillis()
            : new Date(a.date).getTime();
          const timeB = b.date?.toMillis
            ? b.date.toMillis()
            : new Date(b.date).getTime();
          return timeB - timeA;
        });

        const sessions: Record<string, any> = {};
        for (const session of allSessions) {
          if (session.workoutId && !sessions[session.workoutId]) {
            sessions[session.workoutId] = session;
          }
        }
        setLastSessions(sessions);
      } catch (error) {
        console.error("Error fetching last sessions:", error);
      }
    };
    fetchLastSessions();
  }, [user, workouts]);

  // Fetch custom workouts from database
  useEffect(() => {
    if (!user) return;
    const fetchCustomWorkouts = async () => {
      try {
        const q = query(
          collection(db, "workouts"),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        const customWorkouts = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WorkoutPlan[];

        setWorkouts((prev) => {
          const existingIds = new Set(prev.map((w) => w.id));
          const newWorkouts = customWorkouts.filter(
            (w) => !existingIds.has(w.id),
          );
          return [...prev, ...newWorkouts];
        });
      } catch (error) {
        console.error("Error fetching custom workouts:", error);
      }
    };
    fetchCustomWorkouts();
  }, [user]);

  const handleDelete = async (id: string) => {
    const isDefault = workoutPlans.some((w) => w.id === id);
    if (!isDefault) {
      try {
        await deleteDoc(doc(db, "workouts", id));
      } catch (error) {
        console.error("Error deleting workout:", error);
        alert("Failed to delete from database.");
        return; // Stop if db delete fails
      }
    }
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleEdit = (id: string) => {
    // Placeholder: wire this up to open an edit modal or navigate to an edit page
    console.log("Edit workout:", id);
    alert("Edit functionality coming soon!");
  };

  const handleCreate = () => {
    // Reset state when opening
    setNewTitle("");
    setWarmupExercises([]);
    setMainExercises([]);
    setCooldownExercises([]);
    setDialogSearchTerm("");
    setDialogMuscleFilters([]);
    setIsCreateOpen(true);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const getList = (id: string) => {
      if (id === "warmup") return warmupExercises;
      if (id === "main") return mainExercises;
      if (id === "cooldown") return cooldownExercises;
      return [];
    };
    const setList = (id: string, list: string[]) => {
      if (id === "warmup") setWarmupExercises(list);
      if (id === "main") setMainExercises(list);
      if (id === "cooldown") setCooldownExercises(list);
    };

    const sourceList = Array.from(getList(source.droppableId));
    const destList = Array.from(getList(destination.droppableId));

    if (source.droppableId === destination.droppableId) {
      const [reorderedItem] = sourceList.splice(source.index, 1);
      sourceList.splice(destination.index, 0, reorderedItem);
      setList(source.droppableId, sourceList);
    } else {
      const [movedItem] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedItem);
      setList(source.droppableId, sourceList);
      setList(destination.droppableId, destList);
    }
  };

  const handleSaveNewWorkout = async () => {
    if (!newTitle.trim()) return alert("Please enter a workout title.");
    if (
      warmupExercises.length === 0 &&
      mainExercises.length === 0 &&
      cooldownExercises.length === 0
    )
      return alert("Please select at least one exercise.");
    if (!user) return alert("You must be logged in to create a workout.");

    setIsSaving(true);
    try {
      const exercisesToSave = [
        ...warmupExercises.map((id) => ({
          ...allExercises.find((e) => e.id === id),
          phase: "warmup",
        })),
        ...mainExercises.map((id) => ({
          ...allExercises.find((e) => e.id === id),
          phase: "main",
        })),
        ...cooldownExercises.map((id) => ({
          ...allExercises.find((e) => e.id === id),
          phase: "cooldown",
        })),
      ];

      const newWorkout = {
        title: newTitle.trim(),
        exercises: exercisesToSave,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "workouts"), newWorkout);
      const savedWorkout = {
        ...newWorkout,
        id: docRef.id,
      } as unknown as WorkoutPlan;

      setWorkouts((prev) => [...prev, savedWorkout]);
      setIsCreateOpen(false);
      setNewTitle("");
      setWarmupExercises([]);
      setMainExercises([]);
      setCooldownExercises([]);
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to extract all unique muscle groups targeted in a workout
  const getUniqueMuscleGroups = (plan: WorkoutPlan) => {
    const groups = new Set<string>();
    plan.exercises.forEach((ex) => {
      ex.muscleGroups?.forEach((mg) => groups.add(mg));
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

  const isExerciseSelected = (id: string) =>
    warmupExercises.includes(id) ||
    mainExercises.includes(id) ||
    cooldownExercises.includes(id);

  const totalSelected =
    warmupExercises.length + mainExercises.length + cooldownExercises.length;

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
                    {ex.muscleGroups?.map((mg) => (
                      <Badge key={mg} variant="secondary">
                        {mg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                {(ex.description || ex.notes) && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {ex.description || ex.notes}
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

      {/* Create New Workout Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-5xl h-[calc(100vh-8rem)] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Workout</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-8 pt-4 flex-1 overflow-hidden">
            {/* Left Column: Builder */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Workout Title</label>
                <Input
                  placeholder="e.g., Upper Body Power"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <label className="text-sm font-medium mb-2">
                Selected Exercises ({totalSelected})
              </label>
              <div className="flex-grow border rounded-md bg-gray-50/50 dark:bg-slate-900/50 overflow-y-auto p-3 space-y-6">
                <DragDropContext onDragEnd={onDragEnd}>
                  {[
                    { id: "warmup", title: "Warmup", items: warmupExercises },
                    {
                      id: "main",
                      title: "Main Exercises",
                      items: mainExercises,
                    },
                    {
                      id: "cooldown",
                      title: "Cooldown",
                      items: cooldownExercises,
                    },
                  ].map((phase) => (
                    <div key={phase.id}>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 pl-1">
                        {phase.title}
                      </h3>
                      <Droppable droppableId={phase.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-2 min-h-[60px] p-2 rounded-md transition-colors ${
                              snapshot.isDraggingOver
                                ? "bg-sky-50 dark:bg-sky-900/20 outline outline-1 outline-sky-200"
                                : "bg-white dark:bg-slate-800/50"
                            }`}
                          >
                            {phase.items.length === 0 && (
                              <div className="text-center text-gray-400 py-3 text-xs italic">
                                Drop exercises here
                              </div>
                            )}
                            {phase.items.map((exerciseId, index) => {
                              const exercise = allExercises.find(
                                (ex) => ex.id === exerciseId,
                              );
                              if (!exercise) return null;
                              return (
                                <Draggable
                                  key={exercise.id}
                                  draggableId={exercise.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`flex items-center bg-white dark:bg-slate-800 p-2 rounded-md border ${
                                        snapshot.isDragging
                                          ? "shadow-lg border-sky-300 ring-1 ring-sky-300"
                                          : "shadow-sm border-gray-200"
                                      }`}
                                    >
                                      <GripVertical className="h-5 w-5 text-gray-400 mr-2 shrink-0 hover:text-gray-600 transition-colors" />
                                      <span className="flex-grow font-medium text-sm truncate">
                                        {exercise.name}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                        onClick={() => {
                                          setWarmupExercises((prev) =>
                                            prev.filter(
                                              (id) => id !== exercise.id,
                                            ),
                                          );
                                          setMainExercises((prev) =>
                                            prev.filter(
                                              (id) => id !== exercise.id,
                                            ),
                                          );
                                          setCooldownExercises((prev) =>
                                            prev.filter(
                                              (id) => id !== exercise.id,
                                            ),
                                          );
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </DragDropContext>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveNewWorkout} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Workout"}
                </Button>
              </div>
            </div>

            {/* Right Column: Exercise List */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex gap-2 mb-4 shrink-0">
                <Input
                  placeholder="Search exercises..."
                  value={dialogSearchTerm}
                  onChange={(e) => setDialogSearchTerm(e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="shrink-0">
                      Muscles
                      {dialogMuscleFilters.length > 0 &&
                        ` (${dialogMuscleFilters.length})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px]">
                    <div className="max-h-[200px] overflow-y-auto">
                      {allMuscleGroups.map((group) => (
                        <DropdownMenuCheckboxItem
                          key={group}
                          checked={dialogMuscleFilters.includes(group)}
                          onCheckedChange={(checked) => {
                            setDialogMuscleFilters((prev) =>
                              checked
                                ? [...prev, group]
                                : prev.filter((g) => g !== group),
                            );
                          }}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div
                className="flex-1 min-h-0 overflow-y-auto pr-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#0a2647 transparent",

                  background: "transparent",
                }}
              >
                <style>
                  {`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 8px;
                      background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(30, 144, 255, 0.5);
                      border-radius: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: transparent;
                    }
                  `}
                </style>
                {/* Add 'custom-scrollbar' to use custom styles */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                  {filteredDialogExercises.map((ex) => {
                    const isSelected = isExerciseSelected(ex.id);
                    return (
                      <Card
                        key={ex.id}
                        className={`flex flex-col p-3 transition-all duration-200 border ${
                          isSelected
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-900/10 shadow-sm"
                            : "border-gray-200 hover:border-sky-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center flex-wrap gap-2 mb-3">
                          <p className="font-semibold text-sm leading-tight">
                            {ex.name}
                          </p>
                          {ex.muscleGroups?.map((mg) => (
                            <Badge
                              key={mg}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {mg}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant={isSelected ? "secondary" : "outline"}
                          className={`w-full mt-auto shrink-0 transition-all ${isSelected ? "opacity-70 cursor-not-allowed" : "hover:bg-sky-50 hover:text-sky-700"}`}
                          onClick={() => {
                            if (!isSelected) {
                              setMainExercises((prev) => [...prev, ex.id]);
                            }
                          }}
                          disabled={isSelected}
                        >
                          {isSelected ? "Added" : "Add"}
                        </Button>
                      </Card>
                    );
                  })}
                  {filteredDialogExercises.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                      <p>No exercises found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
