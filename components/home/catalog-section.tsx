"use client";

import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { FilterIcon, GridIcon, ListIcon, SearchIcon } from "@/components/icons";
import { getSkill, type LearningItem } from "@/lib/data";
import { filters, type CatalogFilters } from "@/lib/hooks/use-catalog-filters";

function RefineSelect({
  id,
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: readonly string[];
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="metadata mb-1 block text-[color:var(--ink-soft)]">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 text-sm font-bold text-[color:var(--ink-muted)] shadow-sm outline-none transition hover:border-[color:var(--line-strong)] focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[#2a5bff]/15"
      >
        <option value="All">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

// CATALOG — the full library, with filter pills + the active lens.
export function CatalogSection({
  catalog,
  onOpenItem,
}: {
  catalog: CatalogFilters;
  onOpenItem: (item: LearningItem) => void;
}) {
  const {
    filter,
    setFilter,
    viewMode,
    setViewMode,
    skillFilter,
    showRefine,
    setShowRefine,
    practiceAreaFilter,
    setPracticeAreaFilter,
    levelFilter,
    setLevelFilter,
    audienceFilter,
    setAudienceFilter,
    statusFilter,
    setStatusFilter,
    durationFilter,
    setDurationFilter,
    facetOptions,
    noResultSuggestions,
    pathItems,
    catalogItems,
    advancedFilterCount,
    setQuery,
    resetAllFilters,
  } = catalog;

  return (
    <section
      id="browse"
      className="order-2 mx-auto max-w-[1120px] scroll-mt-[calc(5rem+env(safe-area-inset-top,0px))] px-4 py-5 sm:px-6 sm:py-9 lg:order-3 lg:px-10"
      tabIndex={-1}
      aria-label="Learning content"
    >
      <div className="mb-5 border-b border-[color:var(--line)] pb-3.5">
        <p className="section-kicker secondary">Library</p>
        <h2 className="section-title mt-1 text-[1.35rem] text-[color:var(--ink)] sm:text-[1.65rem]">
          All learning options
        </h2>
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowRefine((value) => !value)}
          aria-expanded={showRefine}
          className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-3 text-xs font-bold transition focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15 ${
            showRefine || advancedFilterCount > 0
              ? "border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] text-[color:var(--ink)]"
              : "border-[color:var(--line)] bg-[color:var(--surface-raised)] text-[color:var(--ink-muted)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)]"
          }`}
        >
          <FilterIcon className="h-4 w-4" />
          Refine
          {advancedFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--ink)] px-1.5 text-[0.7rem] font-bold text-[color:var(--surface)]">
              {advancedFilterCount}
            </span>
          )}
        </button>
        <div className="-mx-4 flex max-w-full shrink-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div className="inline-flex shrink-0 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-1">
            {filters.map((entry) => (
              <button
                key={entry}
                className={`h-9 rounded-[8px] px-4 text-xs font-bold transition duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15 ${
                  filter === entry
                    ? "control-active"
                    : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-raised)] hover:text-[color:var(--ink)]"
                }`}
                type="button"
                onClick={() => setFilter(entry)}
                aria-pressed={filter === entry}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>
        {skillFilter && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
          >
            Skill: {getSkill(skillFilter)?.name}
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Clear filter</span>
          </button>
        )}
        <div className="ml-auto hidden rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-1 sm:inline-flex">
          <button
            className={`flex h-9 w-10 items-center justify-center rounded-md ${viewMode === "grid" ? "control-toggle-active" : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"}`}
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <GridIcon className="h-4 w-4" />
          </button>
          <button
            className={`flex h-9 w-10 items-center justify-center rounded-md ${viewMode === "list" ? "control-toggle-active" : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"}`}
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showRefine && (
        <div className="mb-5 rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between gap-3">
            <p className="section-kicker secondary">Refine results</p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="metadata text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus:outline-none"
            >
              Reset all
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <RefineSelect
              id="practice-area-filter"
              label="Practice area"
              value={practiceAreaFilter}
              onChange={setPracticeAreaFilter}
              allLabel="All practice areas"
              options={facetOptions.practiceAreas}
            />
            <RefineSelect
              id="level-filter"
              label="Level"
              value={levelFilter}
              onChange={setLevelFilter}
              allLabel="All levels"
              options={facetOptions.levels}
            />
            <RefineSelect
              id="audience-filter"
              label="Audience"
              value={audienceFilter}
              onChange={(value) => setAudienceFilter(value as typeof audienceFilter)}
              allLabel="All audiences"
              options={facetOptions.audiences}
            />
            <RefineSelect
              id="status-filter"
              label="Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as typeof statusFilter)}
              allLabel="All statuses"
              options={facetOptions.statuses}
            />
            <RefineSelect
              id="duration-filter"
              label="Duration"
              value={durationFilter}
              onChange={(value) => setDurationFilter(value as typeof durationFilter)}
              allLabel="Any duration"
              options={facetOptions.durations}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:hidden">
        {(filter === "Paths" ? pathItems : catalogItems).map((item) => (
          <ContentListRow key={`${item.type}-${item.id}`} item={item} onOpen={onOpenItem} />
        ))}
      </div>

      {viewMode === "grid" ? (
        filter === "Paths" ? (
          <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pathItems.map((item) => (
              <PathCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpenItem} />
            ))}
          </div>
        ) : (
          <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogItems.map((item) =>
              item.type === "PATH" ? (
                <PathCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpenItem} />
              ) : (
                <ContentCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpenItem} />
              ),
            )}
          </div>
        )
      ) : (
        <div className="hidden gap-4 sm:grid">
          {catalogItems.map((item) => (
            <ContentListRow key={`${item.type}-${item.id}`} item={item} onOpen={onOpenItem} />
          ))}
        </div>
      )}

      {catalogItems.length === 0 && (
        <div className="editorial-card rounded-xl border-dashed p-8 text-center">
          <SearchIcon className="mx-auto h-9 w-9 text-[color:var(--ink-soft)]" />
          <h2 className="mt-4 text-xl font-bold text-[color:var(--ink)]">
            No matching learning content
          </h2>
          <p className="mt-2 text-base text-[color:var(--ink-muted)]">
            Try a suggested topic or clear one of the active filters.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {noResultSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-semibold text-[color:var(--ink-muted)] shadow-sm transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  resetAllFilters();
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
