type ProgressBarProps = {
  value: number;
  label: string;
  className?: string;
};

export function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="lace-dash-mono text-[0.65rem] font-medium uppercase tracking-wider text-[var(--lace-dash-muted)]">
          Progress
        </span>
        <span className="lace-dash-mono text-[0.65rem] font-medium text-[var(--lace-dash-cyan)]">{clamped}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[rgba(96,165,250,0.12)]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--lace-dash-teal)] to-[var(--lace-dash-cyan)] transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
