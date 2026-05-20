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
        <span className="stat-label text-[#7d7467]">Progress</span>
        <span className="stat-label text-[#9d7a35]">{clamped}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[#e6dccb] shadow-[inset_0_1px_2px_rgba(40,32,20,0.08)]"
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
