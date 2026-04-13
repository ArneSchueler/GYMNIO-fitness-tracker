"use client";

import { cn, getStatusColor } from "@/lib/utils";
import { CircularProgress } from "../customized/progress/progress-10";
import { Card } from "./card";

interface WidgetCardProps {
  icon: React.ReactNode;
  data: number;
  label: string;
  goal?: number;
  // Wir erweitern die Typen um "workout"
  type: "progress" | "heartrate" | "workout";
  isLoading?: boolean;
}

export default function WidgetCard({
  icon,
  data,
  goal,
  label,
  type,
  isLoading,
}: WidgetCardProps) {
  let percentage = 0;

  // Logik für die verschiedenen Typen
  if (type === "heartrate") {
    // Mapping: 40 BPM = 0%, 200 BPM = 100%
    percentage = Math.min(Math.max(((data - 40) / (200 - 40)) * 100, 0), 100);
  } else if (goal) {
    // Standard Berechnung für Progress & Workout
    percentage = Math.min(Math.round((data / goal) * 100), 100);
  }

  // Holt die dynamische Farbe aus deiner utils.ts
  const statusColor = getStatusColor(percentage, type);
  // Icon Farbe passend zum Ring
  const iconColor = statusColor.replace("stroke-", "text-");

  return (
    <Card className="relative col-span-3 items-center gap-2 p-4 flex flex-col justify-center rounded-2xl bg-[#FBFDFE] shadow-sm border-none">
      {/* Loading / Current Indicator */}
      <div className="absolute top-4 right-4 flex items-center">
        {isLoading ? (
          <span className="relative flex h-2.5 w-2.5" title="Syncing...">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
          </span>
        ) : (
          <span
            className="h-2.5 w-2.5 rounded-full bg-green-500"
            title="Live/Current"
          ></span>
        )}
      </div>

      <CircularProgress
        className="stroke-slate-100"
        progressClassName={cn(
          statusColor,
          "transition-all duration-1000 ease-in-out",
        )}
        renderLabel={<div className={iconColor}>{icon}</div>}
        showLabel
        size={100}
        strokeWidth={12}
        value={percentage}
      />

      <div className="flex flex-col justify-center items-center text-center">
        <div className="flex items-baseline gap-1">
          {/* Hauptzahl */}
          <span className="text-2xl font-bold text-sky-950">
            {data.toLocaleString()}
          </span>

          {/* Einheit nur bei Workout anzeigen */}
          {type === "workout" && (
            <span className="text-xs font-bold text-slate-400">MIN</span>
          )}

          {/* Zielanzeige (Goal) */}
          {goal && (
            <span className="text-sm text-gray-400 font-medium">
              / {goal.toLocaleString()}
            </span>
          )}

          {/* Einheit BPM nur bei Heartrate anzeigen */}
          {type === "heartrate" && (
            <span className="text-xs font-bold text-slate-400">BPM</span>
          )}
        </div>

        {/* Label (unten) */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
          {label}
        </p>
      </div>
    </Card>
  );
}
