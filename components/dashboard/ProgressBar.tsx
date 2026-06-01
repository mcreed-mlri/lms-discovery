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
        <span className="stat-label text-[#8b909d]">Progress</span>
        <span className="stat-label text-[color:var(--brand)]">{clamped}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[color:var(--surface-sunken)] shadow-[inset_0_1px_2px_rgba(28,26,24,0.06)]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#a97824,#c89a3f)] transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
