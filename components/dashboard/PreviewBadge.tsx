export function PreviewBadge() {
  return (
    <span className="metadata inline-flex items-center gap-1.5 rounded-full border border-[color:var(--lace-hairline)] bg-[#fffdf7] px-3 py-1 text-[#706a5f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#b88a2d]" aria-hidden />
      Preview · mock data
    </span>
  );
}
