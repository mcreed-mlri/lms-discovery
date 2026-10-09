"use client";

import { useId, useState, type FormEvent } from "react";

import { CloseIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { useTabNotes } from "@/lib/notes";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

/**
 * "My notes" for a binder tab: the part of the binder that is the advocate's
 * own. Notes-paper fill, private by default, and honest about where they live.
 */
export function NotesPanel({ tabId, tabTitle }: { tabId: string; tabTitle: string }) {
  const { user } = useAuth();
  const { notes, addNote, deleteNote } = useTabNotes(user?.id, tabId);
  const [draft, setDraft] = useState("");
  const headingId = useId();
  const fieldId = useId();
  const hintId = useId();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addNote(draft);
    setDraft("");
  }

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-[14px] border border-[color:var(--notes-edge)] bg-[color:var(--notes-paper)] p-5"
    >
      <h2 id={headingId} className="text-[20px] font-extrabold text-[color:var(--ink)]">
        My notes
      </h2>
      <p id={hintId} className="mt-0.5 text-[13px] text-[color:var(--ink-muted)]">
        Only you can see these. They stay in this browser on this device.
      </p>

      {notes.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-[10px] border border-[color:var(--notes-edge)] bg-[color:var(--surface)] px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] text-[color:var(--ink-soft)]">
                  {dateFormat.format(new Date(note.createdAt))}
                </p>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  aria-label={`Delete note from ${dateFormat.format(new Date(note.createdAt))}`}
                  className="touch-target -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[color:var(--ink-soft)] hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--ink)] focus-ring"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-[color:var(--ink)]">
                {note.text}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={onSubmit} className="mt-4">
        <label htmlFor={fieldId} className="block text-[14px] font-bold text-[color:var(--ink)]">
          Add a note to {tabTitle}
        </label>
        <textarea
          id={fieldId}
          aria-describedby={hintId}
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Something you’ll want next time…"
          className="mt-1.5 w-full resize-y rounded-[10px] border-[1.5px] border-[color:var(--line-control)] bg-[color:var(--surface)] px-3.5 py-3 text-[16px] leading-relaxed text-[color:var(--ink)] placeholder:text-[color:var(--ink-soft)] focus-ring"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="mt-2.5 inline-flex h-11 items-center rounded-[10px] bg-[color:var(--solid-bg)] px-5 text-[15px] font-bold text-[color:var(--solid-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
        >
          Save note
        </button>
      </form>
    </section>
  );
}
