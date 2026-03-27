"use client";

import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0 bis 100
  renderLabel?: React.ReactNode;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: "square" | "round";
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

export const CircularProgress = ({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel,
  shape = "round",
  size = 100,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
}: CircularProgressProps) => {
  // 1. Setup Maße
  const sw = strokeWidth ?? Math.max(circleStrokeWidth, progressStrokeWidth);
  const radius = (size - sw) / 2;
  const circumference = 2 * Math.PI * radius;

  // 2. Tacho-Logik (Öffnung unten)
  // Wir nutzen 270° für den Bogen und 90° für die Lücke unten.
  const arcDegree = 270;
  const gapDegree = 360 - arcDegree;

  // Sichtbare Länge des Bogens
  const visibleLength = (circumference * arcDegree) / 360;

  // 3. Fortschritt berechnen (begrenzt auf 0-100)
  const safeValue = Math.min(Math.max(value, 0), 100);

  // Der Offset steuert, wie viel vom "visibleLength" NICHT gezeichnet wird.
  // Bei 0% ist der Offset = visibleLength (nichts zu sehen).
  // Bei 100% ist der Offset = 0 (alles zu sehen).
  const offset = visibleLength - (safeValue / 100) * visibleLength;

  // 4. Die magische Rotation:
  // Ein SVG-Kreis startet bei 3 Uhr (90°).
  // Um die Öffnung exakt nach unten zu bekommen, müssen wir den Kreis um 135° drehen.
  // Das sorgt dafür, dass der Pfad bei ca. 7 Uhr startet und bei 5 Uhr endet.
  const rotation = 135;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* Grauer Hintergrund-Bogen */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={sw}
          className={cn("stroke-slate-100", className)}
          strokeLinecap={shape}
          // Zeichne nur den Bogen, dann lass eine riesige Lücke
          strokeDasharray={`${visibleLength} ${circumference}`}
        />

        {/* Orangefarbener Fortschritt */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={sw}
          className={cn(
            "stroke-orange-500 transition-all duration-700 ease-out",
            progressClassName,
          )}
          strokeLinecap={shape}
          // Gleiche Basis wie oben
          strokeDasharray={`${visibleLength} ${circumference}`}
          // Schiebe den Startpunkt basierend auf dem Prozentwert
          strokeDashoffset={offset}
        />
      </svg>

      {/* Label (Icon) in der Mitte - absolut positioniert und NICHT mitrotiert */}
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            labelClassName,
          )}
        >
          <div style={{ transform: "rotate(0deg)" }}>
            {" "}
            {/* Sicherstellen, dass Icon gerade steht */}
            {renderLabel}
          </div>
        </div>
      )}
    </div>
  );
};
