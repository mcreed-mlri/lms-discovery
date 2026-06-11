type DashboardStatProps = {
  label: string;
  value: string;
  detail?: string;
};

export function DashboardStat({ label, value, detail }: DashboardStatProps) {
  return (
    <article className="editorial-panel rounded-[var(--radius-card)] p-5">
      <p className="stat-label text-[color:var(--ink-soft)]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--ink)]">{value}</p>
      {detail ? (
        <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">{detail}</p>
      ) : null}
    </article>
  );
}
