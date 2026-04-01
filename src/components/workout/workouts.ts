export type WorkoutPhase = "warm-up" | "main" | "cool-down";

export interface Exercise {
  id: string;
  name: string;
  phase: WorkoutPhase;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: number;
  notes?: string;
  muscleGroups: string[];
  image: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  preparation: string;
  exercises: Exercise[];
}

export const workoutPlans: WorkoutPlan[] = [
  {
    id: "workout-a",
    title: "Training A – Dienstag (Power & Brustmitte)",
    preparation: "Vorbereitung: Hanteln auf ~14,5 kg vorbauen.",
    exercises: [
      // Warm-up
      {
        id: "a1",
        name: "Cat-Cow",
        phase: "warm-up",
        duration: 45,
        muscleGroups: ["Rücken", "Wirbelsäule"],
        image:
          "https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?fit=crop&w=400&q=80",
      },
      {
        id: "a2",
        name: "Bird-Dog",
        phase: "warm-up",
        sets: 2,
        reps: "10/Seite",
        muscleGroups: ["Core", "Rücken"],
        image:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?fit=crop&w=400&q=80",
      },
      {
        id: "a3",
        name: "Scapula Push-ups",
        phase: "warm-up",
        sets: 1,
        reps: "12",
        muscleGroups: ["Schultern", "Rücken"],
        image:
          "https://images.unsplash.com/photo-1556821865-6b5b748d3a51?fit=crop&w=400&q=80",
      },
      {
        id: "a4",
        name: "Box Squats (ohne Gewicht)",
        phase: "warm-up",
        sets: 1,
        reps: "10",
        muscleGroups: ["Beine", "Gluteus"],
        image:
          "https://images.unsplash.com/photo-1509228468518-cd60f1f1af73?fit=crop&w=400&q=80",
      },

      // Hauptteil
      {
        id: "a5",
        name: "Box Squats",
        phase: "main",
        sets: 3,
        reps: "8-10",
        weight: "~14,5 kg",
        muscleGroups: ["Beine", "Gluteus"],
        image:
          "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?fit=crop&w=400&q=80",
      },
      {
        id: "a6",
        name: "KH-Bankdrücken",
        phase: "main",
        sets: 3,
        reps: "6-10",
        weight: "~14,5 kg",
        muscleGroups: ["Brust", "Trizeps", "Schultern"],
        image:
          "https://images.unsplash.com/photo-1599058918140-32b95743bb84?fit=crop&w=400&q=80",
      },
      {
        id: "a7",
        name: "KH-Rudern",
        phase: "main",
        sets: 3,
        reps: "8-12",
        weight: "~14,5 kg",
        muscleGroups: ["Rücken", "Bizeps"],
        image:
          "https://images.unsplash.com/photo-1571019613914-85f342c1d34b?fit=crop&w=400&q=80",
      },
      {
        id: "a8",
        name: "Seitheben",
        phase: "main",
        sets: 3,
        reps: "12-15",
        weight: "3 kg",
        muscleGroups: ["Schultern"],
        image:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?fit=crop&w=400&q=80",
      },
      {
        id: "a9",
        name: "KH-Shrugs",
        phase: "main",
        sets: 3,
        reps: "12-15",
        weight: "~14,5 kg",
        notes: "Oben 2 Sek. halten",
        muscleGroups: ["Nacken", "Schultern"],
        image:
          "https://images.unsplash.com/photo-1445383938728-38f009e2b250?fit=crop&w=400&q=80",
      },
      {
        id: "a10",
        name: "Crunches",
        phase: "main",
        sets: 3,
        reps: "12-15",
        muscleGroups: ["Bauch"],
        image:
          "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?fit=crop&w=400&q=80",
      },

      // Cool-down
      {
        id: "a11",
        name: "Türrahmen-Stretch",
        phase: "cool-down",
        duration: 60,
        muscleGroups: ["Brust", "Schultern"],
        image:
          "https://images.unsplash.com/photo-1534367610401-f58b3287df71?fit=crop&w=400&q=80",
      },
      {
        id: "a12",
        name: "Ausfallschritt im Stehen",
        phase: "cool-down",
        duration: 60,
        muscleGroups: ["Beine", "Gluteus", "Hüfte"],
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80",
      },
      {
        id: "a13",
        name: "Figure-4 Stretch",
        phase: "cool-down",
        duration: 45,
        muscleGroups: ["Gluteus", "Beine", "Hüfte"],
        image:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?fit=crop&w=400&q=80",
      },
    ],
  },
  {
    id: "workout-b",
    title: "Training B – Freitag (V-Form & Obere Brust)",
    preparation: "Vorbereitung: Hanteln auf ~12 kg vorbauen.",
    exercises: [
      // Warm-up
      {
        id: "b1",
        name: "90/90 Hip Stretch",
        phase: "warm-up",
        duration: 45,
        muscleGroups: ["Hüfte", "Gluteus"],
        image:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?fit=crop&w=400&q=80",
      },
      {
        id: "b2",
        name: "Glute Bridge Hold",
        phase: "warm-up",
        duration: 45,
        muscleGroups: ["Gluteus", "Core"],
        image:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?fit=crop&w=400&q=80",
      },
      {
        id: "b3",
        name: "Band Pull-Aparts",
        phase: "warm-up",
        sets: 1,
        reps: "20",
        muscleGroups: ["Rücken", "Schultern"],
        image:
          "https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?fit=crop&w=400&q=80",
      },
      {
        id: "b4",
        name: "Wall Slides",
        phase: "warm-up",
        sets: 1,
        reps: "10",
        muscleGroups: ["Schultern", "Rücken"],
        image:
          "https://images.unsplash.com/photo-1534367610401-f58b3287df71?fit=crop&w=400&q=80",
      },

      // Hauptteil
      {
        id: "b5",
        name: "Glute Bridge",
        phase: "main",
        sets: 3,
        reps: "10-15",
        weight: "~12 kg",
        muscleGroups: ["Gluteus", "Core"],
        image:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?fit=crop&w=400&q=80",
      },
      {
        id: "b6",
        name: "Latzug",
        phase: "main",
        sets: 3,
        reps: "8-12",
        muscleGroups: ["Rücken", "Bizeps"],
        image:
          "https://images.unsplash.com/photo-1571019613914-85f342c1d34b?fit=crop&w=400&q=80",
      },
      {
        id: "b7",
        name: "Schulterdrücken",
        phase: "main",
        sets: 3,
        reps: "6-10",
        weight: "~12 kg",
        muscleGroups: ["Schultern", "Trizeps"],
        image:
          "https://images.unsplash.com/photo-1599058918140-32b95743bb84?fit=crop&w=400&q=80",
      },
      {
        id: "b8",
        name: "Schrägbankdrücken",
        phase: "main",
        sets: 3,
        reps: "8-12",
        weight: "~12 kg",
        muscleGroups: ["Brust", "Schultern", "Trizeps"],
        image:
          "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?fit=crop&w=400&q=80",
      },
      {
        id: "b9",
        name: "Reverse Flys",
        phase: "main",
        sets: 3,
        reps: "12-15",
        weight: "3 kg",
        muscleGroups: ["Rücken", "Schultern"],
        image:
          "https://images.unsplash.com/photo-1556821865-6b5b748d3a51?fit=crop&w=400&q=80",
      },
      {
        id: "b10",
        name: "Crunches",
        phase: "main",
        sets: 3,
        reps: "12-15",
        muscleGroups: ["Bauch"],
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80",
      },

      // Cool-down
      {
        id: "b11",
        name: "Puppy Pose / Lat-Stretch",
        phase: "cool-down",
        duration: 60,
        muscleGroups: ["Rücken", "Schultern"],
        image:
          "https://images.unsplash.com/photo-1534367610401-f58b3287df71?fit=crop&w=400&q=80",
      },
      {
        id: "b12",
        name: "Child’s Pose",
        phase: "cool-down",
        duration: 60,
        muscleGroups: ["Rücken", "Hüfte"],
        image:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?fit=crop&w=400&q=80",
      },
      {
        id: "b13",
        name: "Piriformis-Stretch",
        phase: "cool-down",
        duration: 45,
        muscleGroups: ["Gluteus", "Hüfte"],
        image:
          "https://images.unsplash.com/photo-1509228468518-cd60f1f1af73?fit=crop&w=400&q=80",
      },
    ],
  },
];
