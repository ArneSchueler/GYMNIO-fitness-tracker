"use client";

import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
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
  const radius = size / 2 - 10;
  const circumference = Math.ceil(3.14 * radius * 2);
  const percentage = Math.ceil(circumference * ((100 - value) / 100));

  const viewBox = `-${size * 0.125} -${size * 0.125} ${size * 1.25} ${
    size * 1.25
  }`;

  return (
    <div className="relative">
      <svg
        className="relative"
        height={size}
        version="1.1"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g style={{ transform: "rotate(135deg)", transformOrigin: "center" }}>
          {" "}
          {/* Base Circle */}
          <circle
            className={cn("stroke-primary/25", className)}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset="80"
            strokeWidth={strokeWidth ?? circleStrokeWidth}
          />
          {/* Progress */}
          <circle
            className={cn("stroke-primary", progressClassName)}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset="190"
            strokeLinecap={shape}
            strokeWidth={strokeWidth ?? progressStrokeWidth}
          />
        </g>
      </svg>
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-md",
            labelClassName,
          )}
        >
          {renderLabel ? renderLabel : "icon"}
        </div>
      )}
    </div>
  );
};

// export default function CircularProgressColorDemo() {
//   const [progress, setProgress] = React.useState([13]);

//   return (
//     <div className="mx-auto flex w-full max-w-xs flex-col items-center">
//       <div className="flex items-center gap-1">
//         <CircularProgress
//           className="stroke-indigo-500/25"
//           labelClassName="text-xl font-bold"
//           progressClassName="stroke-indigo-600"
//           renderLabel={(progress) => `${progress}%`}
//           showLabel
//           size={180}
//           strokeWidth={10}
//           value={progress[0]}
//         />
//         <CircularProgress
//           className="stroke-orange-500/25"
//           labelClassName="text-xl font-bold"
//           progressClassName="stroke-orange-600"
//           renderLabel={(progress) => `${progress}%`}
//           showLabel
//           size={120}
//           strokeWidth={10}
//           value={progress[0]}
//         />
//       </div>
//     </div>
//   );
// }
