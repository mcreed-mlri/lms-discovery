"use client";

import { SearchIcon } from "@/components/icons";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
};

export function SearchBox({ value, onChange, compact = false }: SearchBoxProps) {
  return (
    <label className={`group relative block ${compact ? "w-full" : "w-full max-w-2xl"}`}>
      <span className="sr-only">Search courses, modules, paths, or topics</span>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-mlri-blue" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-base font-semibold text-slate-950 shadow-soft outline-none transition placeholder:text-slate-500 focus:border-mlri-sky focus:ring-4 focus:ring-sky-100 ${
          compact ? "h-12" : "h-14"
        }`}
        placeholder="Search courses, modules, paths, or topics..."
        type="search"
      />
    </label>
  );
}
