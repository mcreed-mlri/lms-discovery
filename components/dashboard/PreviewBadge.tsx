export function PreviewBadge() {
  return (
    <span className="metadata inline-flex items-center gap-1.5 rounded-full border border-[color:var(--lace-hairline)] bg-[color:var(--surface-raised)] px-3 py-1 text-[color:var(--ink-soft)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#2a5bff]" aria-hidden />
      Preview · mock data
    </span>
  );
}
