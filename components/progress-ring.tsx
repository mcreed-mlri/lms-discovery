import type { ReactNode } from "react";

type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
  label?: string;
};

// A compact circular progress indicator. Used in the Continue-learning card
// and the dashboard KPI tiles so progress reads at a glance, not as a number.
// `color` / `trackColor` are applied via inline style so callers can pass a
// CSS variable (e.g. a topic-colour token) and not only a raw hex value.
export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  color = "var(--brand)",
  trackColor = "var(--surface-sunken)",
  children,
  label,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${Math.round(clamped)} percent complete`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={{ stroke: trackColor }}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={{ stroke: color }}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
