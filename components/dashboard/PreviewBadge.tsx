export function PreviewBadge() {
  return (
    <span className="lace-dash-mono inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.35)] bg-[rgba(45,212,191,0.08)] px-3 py-1 text-[0.62rem] font-medium uppercase tracking-wider text-[var(--lace-dash-teal)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--lace-dash-teal)]" aria-hidden />
      Preview · mock data
    </span>
  );
}
