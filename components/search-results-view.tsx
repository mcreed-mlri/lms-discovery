"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";

import { SearchIcon } from "@/components/icons";
import { StudioShell } from "@/components/studio-shell";
import { getEligibleLearningItems } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBinder } from "@/lib/binder";
import type { BinderHit } from "@/lib/binder-search";
import { getLearningItems } from "@/lib/data";
import { browseHref } from "@/lib/home-helpers";
import { getNoResultSuggestions, type SearchResult } from "@/lib/search";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import { searchEverything, searchHref } from "@/lib/search-results";
import { analyzeQuery } from "@/lib/search-vocabulary";

const libraryKind = { COURSE: "Course", MODULE: "Module", PATH: "Path" } as const;

/**
 * The full results for a query. Binder results come first (quickest answer
 * first: reference, practice, lesson, topic), then the library. Opened from a
 * binder page (?in=litigation), that binder's results lead and the rest follow
 * under "Elsewhere". Citations the query contains are named, so it is clear
 * why a result about summary process answered "c. 239".
 */
export function SearchResultsView({
  initialQuery,
  scopeBinderId,
}: {
  initialQuery: string;
  scopeBinderId?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const fieldId = useId();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  // The query this view last wrote to the address. Any other change to the
  // address (back button, a "Try" link) is a new search and resets the field.
  const lastWritten = useRef(initialQuery.trim());
  useEffect(() => {
    if (initialQuery.trim() === lastWritten.current) return;
    lastWritten.current = initialQuery.trim();
    setQuery(initialQuery);
  }, [initialQuery]);
  const scope = scopeBinderId ? getBinder(scopeBinderId) : undefined;

  const items = useMemo(() => getEligibleLearningItems(getLearningItems(), user), [user]);
  const { binderHits, library } = useMemo(
    () => searchEverything(items, deferredQuery, { full: true, preferBinderId: scope?.id }),
    [items, deferredQuery, scope?.id],
  );
  const recognised = useMemo(() => analyzeQuery(deferredQuery).citations, [deferredQuery]);
  const inScope = scope ? binderHits.filter((hit) => hit.binderId === scope.id) : [];
  const elsewhere = scope ? binderHits.filter((hit) => hit.binderId !== scope.id) : binderHits;
  const count = binderHits.length + library.length;
  const trimmed = deferredQuery.trim();

  // Keep the address in step with the field, so results can be shared and the
  // back button returns here. Logged once typing settles.
  useEffect(() => {
    if (!trimmed) return;
    const handle = window.setTimeout(() => {
      lastWritten.current = trimmed;
      router.replace(searchHref(trimmed, scope?.id), { scroll: false });
      recordSearchAnalytics({
        type: "search_performed",
        query: trimmed,
        resultCount: count,
        filters: { page: "search", in: scope?.id ?? "all" },
      });
    }, 500);
    return () => window.clearTimeout(handle);
  }, [trimmed, count, scope?.id, router]);

  function recordPick(id: string, kind: string, title: string) {
    recordSearchAnalytics({
      type: "search_result_selected",
      query: trimmed,
      resultId: id,
      resultType: kind,
      resultTitle: title,
    });
  }

  return (
    <StudioShell>
      <div className="flex max-w-[52rem] flex-col gap-8">
        <div>
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[color:var(--ink)]">
            Search
          </h1>
          <form
            role="search"
            className="relative mt-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor={fieldId} className="sr-only">
              Search references, practice, courses and topics
            </label>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--ink-soft)]" />
            <input
              id={fieldId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What’s in front of you today?"
              className="h-14 w-full rounded-[8px] border-[1.5px] border-[color:var(--line-control)] bg-[color:var(--surface-raised)] pl-12 pr-4 text-[17px] font-semibold text-[color:var(--ink)] outline-none placeholder:font-normal placeholder:text-[color:var(--ink-soft)] focus:border-[color:var(--brand)] focus-ring"
            />
          </form>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[14px] text-[color:var(--ink-muted)]">
            {trimmed ? (
              <p aria-live="polite">
                {count === 0 ? "No results" : `${count} ${count === 1 ? "result" : "results"}`}
                {scope ? ` · ${scope.name} first` : null}
              </p>
            ) : null}
            {scope && trimmed ? (
              <Link
                href={searchHref(trimmed)}
                className="rounded-[3px] font-semibold text-[color:var(--ink)] underline underline-offset-[3px] focus-ring"
              >
                Search all binders equally
              </Link>
            ) : null}
          </div>

          {recognised.length > 0 ? (
            <p className="mt-2 text-[14px] text-[color:var(--ink-muted)]">
              {recognised.map((entry, index) => (
                <span key={entry.cite}>
                  {index > 0 ? " · " : null}
                  Recognised{" "}
                  <span className="font-semibold text-[color:var(--ink)]">{entry.cite}</span>:{" "}
                  {entry.about}
                </span>
              ))}
            </p>
          ) : null}
        </div>

        {!trimmed ? (
          <p className="text-[15px] text-[color:var(--ink-muted)]">
            Search by topic, situation or citation, for example “hearsay objection”, “client got a
            notice to quit”, or “G.L. c. 239”.
          </p>
        ) : count === 0 ? (
          <NoResults query={trimmed} scopeId={scope?.id} />
        ) : (
          <>
            {scope && inScope.length > 0 ? (
              <HitList
                id="in-scope"
                heading={`In ${scope.name}`}
                hits={inScope}
                onPick={recordPick}
              />
            ) : null}
            {elsewhere.length > 0 ? (
              <HitList
                id="binders"
                heading={scope ? "Elsewhere in your binders" : "In your binders"}
                hits={elsewhere}
                onPick={recordPick}
              />
            ) : null}
            {library.length > 0 ? (
              <LibraryList results={library} query={trimmed} onPick={recordPick} />
            ) : null}
          </>
        )}
      </div>
    </StudioShell>
  );
}

const sectionHeading = "text-[20px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]";
const rowClass =
  "flex min-h-11 flex-col gap-1 py-3.5 text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring";
const chipClass =
  "metadata inline-flex w-fit items-center rounded-md border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2 py-0.5 leading-none text-[color:var(--ink-soft)]";

function HitList({
  id,
  heading,
  hits,
  onPick,
}: {
  id: string;
  heading: string;
  hits: BinderHit[];
  onPick: (id: string, kind: string, title: string) => void;
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className={sectionHeading}>
        {heading}
      </h2>
      <ul className="mt-3 border-t-[1.5px] border-[color:var(--ink)]">
        {hits.map((hit) => {
          const body = (
            <>
              <span className="flex flex-wrap items-center gap-2">
                <span className={chipClass}>{hit.kind}</span>
                <span className="text-[13px] text-[color:var(--ink-soft)]">{hit.context}</span>
              </span>
              <span className="text-[16px] font-bold">{hit.title}</span>
            </>
          );
          const pick = () => onPick(hit.id, hit.kind, hit.title);
          return (
            <li key={hit.id} className="border-b border-[color:var(--line)]">
              {/* Course package pages are static files outside the app. */}
              {/\.html(#|$)/.test(hit.href) ? (
                <a href={hit.href} onClick={pick} className={rowClass}>
                  {body}
                </a>
              ) : (
                <Link href={hit.href} onClick={pick} className={rowClass}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function LibraryList({
  results,
  query,
  onPick,
}: {
  results: SearchResult[];
  query: string;
  onPick: (id: string, kind: string, title: string) => void;
}) {
  return (
    <section aria-labelledby="library">
      <h2 id="library" className={sectionHeading}>
        Library
      </h2>
      <p className="mt-0.5 text-[13px] text-[color:var(--ink-soft)]">
        Courses, modules and paths, including planned ones.
      </p>
      <ul className="mt-3 border-t-[1.5px] border-[color:var(--ink)]">
        {results.map((result) => {
          const kind = libraryKind[result.item.type];
          const planned = "availability" in result.item && result.item.availability === "planned";
          return (
            <li key={result.document.id} className="border-b border-[color:var(--line)]">
              <Link
                href={browseHref({
                  q: query,
                  open: `${result.item.type}-${result.item.id}`,
                })}
                onClick={() => onPick(result.document.id, result.item.type, result.item.title)}
                className={rowClass}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className={chipClass}>{kind}</span>
                  {planned ? <span className={chipClass}>Planned</span> : null}
                  <span className="text-[13px] text-[color:var(--ink-soft)]">{result.context}</span>
                </span>
                <span className="text-[16px] font-bold">{result.item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function NoResults({ query, scopeId }: { query: string; scopeId?: string }) {
  const suggestions = getNoResultSuggestions(query);
  return (
    <section aria-labelledby="no-results" className="flex flex-col gap-4">
      <h2 id="no-results" className={sectionHeading}>
        Nothing found for “{query}”
      </h2>
      <p className="text-[15px] text-[color:var(--ink-muted)]">
        It may not be built yet, or it may go by another name.
      </p>
      {suggestions.length > 0 ? (
        <div>
          <p className="text-[14px] font-semibold text-[color:var(--ink)]">Try</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <Link
                  href={searchHref(suggestion, scopeId)}
                  className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--line)] px-4 text-[14px] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                >
                  {suggestion}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="text-[14px] text-[color:var(--ink-muted)]">
        Or look through the{" "}
        <Link
          href="/browse"
          className="font-semibold text-[color:var(--ink)] underline underline-offset-[3px]"
        >
          library
        </Link>{" "}
        and the{" "}
        <Link
          href="/curriculum-map"
          className="font-semibold text-[color:var(--ink)] underline underline-offset-[3px]"
        >
          curriculum map
        </Link>
        .
      </p>
    </section>
  );
}
