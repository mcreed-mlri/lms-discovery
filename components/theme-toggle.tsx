"use client";

import { useTheme } from "@/app/providers";
import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle({
  collapsed = false,
  className = "",
}: {
  collapsed?: boolean;
  className?: string;
}) {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const Icon = isDark ? SunIcon : MoonIcon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={`flex h-[38px] shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15 ${
        collapsed ? "w-[38px]" : "w-full gap-2 px-3"
      } ${className}`}
    >
      <Icon className="h-[18px] w-[18px]" />
      {!collapsed && <span className="text-[13px] font-semibold">{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}
