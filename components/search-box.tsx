"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import type { SearchResult } from "@/lib/search";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions?: SearchResult[];
  onSelect?: (result: SearchResult) => void;
  compact?: boolean;
};

export function SearchBox({ value, onChange, suggestions = [], onSelect, compact = false }: SearchBoxProps) {
  const inputId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasQuery = value.trim().length > 0;
  const showSuggestions = hasQuery && isOpen;

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions, value]);

  function selectResult(result: SearchResult) {
    setIsOpen(false);
    onChange(result.item.title);
    onSelect?.(result);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (suggestions.length === 0 ? 0 : Math.min(current + 1, suggestions.length - 1)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" && hasQuery) {
      const result = suggestions[activeIndex] ?? suggestions[0];
      if (result) {
        event.preventDefault();
        selectResult(result);
      }
    }
  }

  return (
    <div className={`group relative ${compact ? "w-full" : "w-full max-w-2xl"}`}>
      <label className="sr-only" htmlFor={inputId}>
        Search courses, modules, paths, or topics
      </label>
      <SearchIcon className={`pointer-events-none absolute left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-mlri-blue ${compact ? "top-5" : "top-6"}`} />
      <input
        aria-activedescendant={showSuggestions && suggestions[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={showSuggestions}
        value={value}
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-base font-semibold text-slate-950 shadow-soft outline-none transition placeholder:text-slate-500 focus:border-mlri-sky focus:ring-4 focus:ring-sky-100 ${
          compact ? "h-10" : "h-12"
        }`}
        id={inputId}
        placeholder="Search courses, modules, paths, or topics..."
        role="combobox"
        type="search"
      />
      {showSuggestions && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-lift"
          id={listboxId}
          role="listbox"
        >
          {suggestions.length > 0 ? (
            suggestions.map((result, index) => (
              <button
                aria-selected={activeIndex === index}
                className={`grid w-full grid-cols-[1fr_auto] gap-3 px-3 py-2.5 text-left transition ${
                  activeIndex === index ? "bg-mlri-mist" : "bg-white hover:bg-slate-50"
                }`}
                id={`${listboxId}-${index}`}
                key={`${result.item.type}-${result.item.id}`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectResult(result)}
                role="option"
                title="Details coming soon"
                type="button"
              >
                <span className="min-w-0">
                  <span className="mb-2 flex flex-wrap items-center gap-2">
                    <TypeBadge type={result.item.type} />
                    <span className="truncate text-xs font-bold text-slate-600">{result.context}</span>
                  </span>
                  <span className="block truncate text-sm font-extrabold text-slate-950">{result.item.title}</span>
                </span>
                <span className="self-center rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-wide text-slate-600">
                  Preview
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-4 text-sm font-bold text-slate-600" role="option" aria-selected="false">
              No matches. Try evictions, intake, motions, or courtroom procedures.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
