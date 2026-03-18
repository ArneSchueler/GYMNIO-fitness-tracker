import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(
  percentage: number,
  type: "progress" | "heartrate" | "workout",
) {
  if (type === "heartrate") {
    if (percentage < 20) return "stroke-blue-400"; // Ruhepuls
    if (percentage < 60) return "stroke-emerald-500"; // Idealbereich
    if (percentage < 85) return "stroke-orange-500"; // Intensiv
    return "stroke-red-600"; // Maximum
  }

  if (type === "workout") {
    // Workout-Farben: Gelb/Orange währenddessen, Grün wenn fertig
    if (percentage >= 100) return "stroke-emerald-500";
    return "stroke-yellow-500";
  }

  // Für Kalorien / Schritte: Rot -> Orange -> Grün
  if (percentage < 30) return "stroke-red-500";
  if (percentage < 70) return "stroke-orange-500";
  return "stroke-emerald-500"; // Ziel fast erreicht oder überschritten
}
