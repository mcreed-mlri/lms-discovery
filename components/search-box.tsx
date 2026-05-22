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
  prominent?: boolean;
};

export function SearchBox({ value, onChange, suggestions = [], onSelect, compact = false, prominent = false }: SearchBoxProps) {
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
    <div className={`group relative ${compact || prominent ? "w-full" : "w-full max-w-2xl"}`}>
      <label className="sr-only" htmlFor={inputId}>
        Search courses, modules, paths, or topics
      </label>
      <SearchIcon className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[color:var(--ink-soft)] transition group-focus-within:text-[color:var(--brand)] ${prominent ? "left-5 h-5 w-5" : "left-3.5 h-4 w-4"}`} />
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
        className={`w-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] font-semibold text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--ink-soft)] hover:border-[color:var(--line-strong)] focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[#b88a2d]/15 ${
          prominent
            ? "h-14 rounded-[var(--radius-control)] pl-14 pr-5 text-[1.02rem] shadow-[var(--shadow-sm)]"
            : `rounded-[var(--radius-control)] pl-10 pr-4 text-base shadow-[var(--shadow-xs)] ${compact ? "h-9 text-sm" : "h-12"}`
        }`}
        id={inputId}
        placeholder="Search the library - ethics, intake, first appearance..."
        role="combobox"
        type="search"
      />
      {showSuggestions && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-raised)] text-[color:var(--ink)] shadow-[var(--shadow-lg)]"
          id={listboxId}
          role="listbox"
        >
          {suggestions.length > 0 ? (
            suggestions.map((result, index) => (
              <button
                aria-selected={activeIndex === index}
                className={`grid w-full grid-cols-[1fr_auto] gap-3 px-3 py-2.5 text-left transition ${
                  activeIndex === index ? "bg-[color:var(--surface-sunken)]" : "bg-[color:var(--surface-raised)] hover:bg-[color:var(--surface)]"
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
                    <span className="metadata truncate text-[color:var(--ink-soft)]">{result.context}</span>
                  </span>
                  <span className="block truncate text-sm font-bold text-[color:var(--ink)]">{result.item.title}</span>
                </span>
                <span className="metadata self-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2.5 py-1 text-[color:var(--ink-soft)]">
                  Preview
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-4 text-sm font-bold text-[color:var(--ink-muted)]" role="option" aria-selected="false">
              No matches. Try evictions, intake, motions, or courtroom procedures.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
