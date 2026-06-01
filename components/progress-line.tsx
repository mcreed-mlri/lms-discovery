type ProgressLineProps = {
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
  label?: string;
  className?: string;
};

// Compact horizontal progress — used where a ring would compete with another
// ring on the same screen (e.g. module progress vs. annual training hours goal).
export function ProgressLine({
  value,
  color = "var(--brand-fill)",
  trackColor = "var(--surface-sunken)",
  height = 6,
  label,
  className = "",
}: ProgressLineProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`overflow-hidden rounded-full ${className}`}
      style={{ height, background: trackColor }}
      role="progressbar"
      aria-label={label ?? `${Math.round(clamped)} percent complete`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}
