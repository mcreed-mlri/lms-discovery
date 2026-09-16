"use client";

import Link from "next/link";
import { useEffect } from "react";
import { EdgeScroller } from "@/components/edge-scroller";
import { ChevronLeftIcon } from "@/components/icons";

import { SectionHead } from "@/components/home/section-head";
import { StudioShell } from "@/components/studio-shell";
import {
  curriculumMap,
  type CurriculumBranch,
  type CurriculumColumn,
  type CurriculumNote,
} from "@/lib/curriculum-map";
import { getLearningItemById, getLearningItemUrl } from "@/lib/data";
import { getHue } from "@/lib/skill-hue";

// Where a curriculum topic maps to a built catalog course, resolve its link so
// the note is clickable. Everything else renders as a "planned" node.
function courseHref(note: CurriculumNote): string | null {
  if (!note.courseId) return null;
  const item = getLearningItemById(note.courseId);
  return item ? getLearningItemUrl(item) : null;
}

function Note({ note }: { note: CurriculumNote }) {
  const href = courseHref(note);
  const isSub = note.level === "sub";

  const body = (
    <span className="flex items-start justify-between gap-2">
      <span className="leading-snug">{note.text}</span>
      {href ? (
        <span className="mt-0.5 shrink-0 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
          Built
        </span>
      ) : null}
    </span>
  );

  const tag = note.tag ? (
    <span className="mt-1.5 inline-block rounded-full border border-[color:var(--line)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-[color:var(--ink-soft)]">
      {note.tag}
    </span>
  ) : null;

  const base = `block rounded-[9px] border px-3 py-2 text-[13px] transition ${
    isSub
      ? "ml-3 border-dashed border-[color:var(--line)] bg-transparent text-[color:var(--ink-muted)]"
      : "border-[color:var(--line)] bg-[color:var(--surface)] font-semibold text-[color:var(--ink)] shadow-[var(--shadow-xs)]"
  }`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} hover:border-[color:var(--ink)] hover:shadow-[var(--shadow-card)] focus-ring`}
      >
        {body}
        {tag}
      </Link>
    );
  }

  return (
    <div className={base}>
      {body}
      {tag}
    </div>
  );
}

function Column({ column }: { column: CurriculumColumn }) {
  return (
    <div
      id={`column-${column.id}`}
      className="flex w-[240px] shrink-0 scroll-mt-6 flex-col rounded-[12px] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-3 sm:w-[264px]"
    >
      <h3 className="mb-2.5 px-1 text-[14px] font-bold tracking-[-0.01em] text-[color:var(--ink)]">
        {column.title}
      </h3>
      {column.notes.length ? (
        <div className="flex flex-col gap-1.5">
          {column.notes.map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <p className="px-1 py-2 text-[12px] font-medium italic text-[color:var(--ink-soft)]">
          In development — topics coming soon.
        </p>
      )}
    </div>
  );
}

function Branch({ branch }: { branch: CurriculumBranch }) {
  return (
    <section className="mb-10">
      <SectionHead kicker="Curriculum branch" title={branch.title} />
      {branch.type === "columns" ? (
        /* This region scrolls horizontally and its children are static text, so
           there is nothing inside for the keyboard to land on — a keyboard-only
           user could not scroll it at all. `focusable` is what axe's
           scrollable-region-focusable rule (WCAG 2.1.1) asks for; EdgeScroller
           draws the matching focus ring on its unmasked frame, since a
           focusable element with no visible focus indicator trades one failure
           for another (2.4.7). */
        <EdgeScroller
          className="-mx-1 flex gap-3 px-1 pb-3"
          focusable
          label={`${branch.title}: scrollable columns`}
        >
          {branch.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </EdgeScroller>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {branch.tiles.map((tile) => (
            <div
              key={tile.id}
              className="rounded-[10px] border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2.5 text-[13px] font-semibold text-[color:var(--ink)] shadow-[var(--shadow-xs)]"
            >
              {tile.text}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Display labels for the quick-jump nav — the branch titles read right as
// in-page section headings ("Legal Skills") but the nav pairs them with what
// they actually are: training content to jump to, not a taxonomy.
const NAV_LABELS: Record<string, string> = {
  "legal-skills": "Skills training",
  "substantive-law": "Subject-area training",
};

function jumpToColumn(columnId: string) {
  document
    .getElementById(`column-${columnId}`)
    ?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

function NavGroup({ branch, defaultOpen }: { branch: CurriculumBranch; defaultOpen: boolean }) {
  if (branch.type !== "columns") return null;
  return (
    <details
      open={defaultOpen}
      className="group border-b border-[color:var(--line)] py-1 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-[var(--radius-control)] px-2 py-2.5 marker:content-none focus-ring [&::-webkit-details-marker]:hidden">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[color:var(--ink-soft)]">
          {NAV_LABELS[branch.id] ?? branch.title}
        </span>
        <ChevronLeftIcon className="h-3.5 w-3.5 shrink-0 -rotate-90 text-[color:var(--ink-soft)] transition-transform duration-200 group-open:rotate-90" />
      </summary>
      <ul className="flex flex-col gap-0.5 pb-2">
        {branch.columns.map((column, index) => {
          const hue = getHue(index);
          return (
            <li key={column.id}>
              <button
                type="button"
                onClick={() => jumpToColumn(column.id)}
                className="flex w-full items-center gap-2.5 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[color:var(--ink-muted)] transition hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--ink)] focus-ring"
              >
                <span
                  className="h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: hue.solid }}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">{column.title}</span>
                <span className="text-[11px] font-medium text-[color:var(--ink-soft)]">
                  {column.notes.length}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function CurriculumMapNav() {
  return (
    <nav
      aria-label="Jump to curriculum section"
      className="rounded-[12px] border border-[color:var(--line)] bg-[color:var(--surface)] p-2 shadow-[var(--shadow-xs)] lg:sticky lg:top-8"
    >
      {curriculumMap.branches.map((branch) => (
        <NavGroup key={branch.id} branch={branch} defaultOpen />
      ))}
    </nav>
  );
}

export default function CurriculumMapPage() {
  // Land on the right column when arriving via a deep link (e.g. the rail's
  // subject-area rows link to `#column-<id>`) — a plain browser anchor jump
  // only scrolls the page vertically and leaves the column off-screen inside
  // the horizontally-scrolling branch.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const timer = setTimeout(() => {
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StudioShell>
      <div className="lg:flex lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1">
          <header className="mb-8">
            <p className="editorial-eyebrow text-[color:var(--ink-soft)]">
              Faculty &amp; content creators
            </p>
            <h1 className="hero-title mt-2 text-3xl text-[color:var(--ink)] sm:text-4xl">
              Curriculum Map
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[color:var(--ink-muted)]">
              How the LACE curriculum is organized — the Legal Skills that carry across the case
              lifecycle, and the Substantive Law areas beside them. This map is a work in progress:
              topics marked <span className="font-semibold text-[color:var(--brand)]">Built</span>{" "}
              link to a live course you can open now; everything else is planned as the curriculum
              develops.
            </p>
          </header>

          {curriculumMap.branches.map((branch) => (
            <Branch key={branch.id} branch={branch} />
          ))}
        </div>

        <div className="mb-8 mt-2 lg:mb-0 lg:mt-0 lg:w-[260px] lg:shrink-0">
          <CurriculumMapNav />
        </div>
      </div>
    </StudioShell>
  );
}
