type DashboardStatProps = {
  label: string;
  value: string;
  detail?: string;
};

export function DashboardStat({ label, value, detail }: DashboardStatProps) {
  return (
    <article className="lace-dash-card p-5">
      <p className="lace-dash-mono text-[0.65rem] font-medium uppercase tracking-wider text-[var(--lace-dash-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--lace-dash-text)]">{value}</p>
      {detail ? (
        <p className="mt-2 text-sm text-[var(--lace-dash-muted)]">{detail}</p>
      ) : null}
    </article>
  );
}
