"use client";

import Link from "next/link";

import { SectionHead } from "@/components/home/section-head";
import { StudioShell } from "@/components/studio-shell";
import {
  curriculumMap,
  type CurriculumBranch,
  type CurriculumColumn,
  type CurriculumNote,
} from "@/lib/curriculum-map";
import { getLearningItemById, getLearningItemUrl } from "@/lib/data";

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
    <div className="flex w-[240px] shrink-0 flex-col rounded-[12px] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-3 sm:w-[264px]">
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
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-3">
          {branch.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>
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

export default function CurriculumMapPage() {
  return (
    <StudioShell>
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
          topics marked <span className="font-semibold text-[color:var(--brand)]">Built</span> link
          to a live course you can open now; everything else is planned as the curriculum develops.
        </p>
      </header>

      {curriculumMap.branches.map((branch) => (
        <Branch key={branch.id} branch={branch} />
      ))}
    </StudioShell>
  );
}
