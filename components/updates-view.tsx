"use client";

import { useMemo, useState } from "react";
import { DetailModal } from "@/components/detail-modal";
import { UpdateCard } from "@/components/update-card";
import { contentUpdates, getLearningItems, type LearningItem } from "@/lib/data";
import { useSavedLearning } from "@/lib/saved-learning";

export function UpdatesView() {
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const allItems = useMemo(() => getLearningItems(), []);
  const savedLearning = useSavedLearning();

  function openItemById(id: string) {
    const match = allItems.find((item) => item.id === id);
    if (match) setSelectedItem(match);
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-b border-[color:var(--line)] pb-4">
          <h1 className="section-title text-2xl text-[color:var(--ink)]">Updates</h1>
          <p className="mt-2 text-[color:var(--ink-muted)]">
            Changes to modules, checklists, and practice guidance.
          </p>
          {/*
            Every entry in contentUpdates is sample copy written to show the
            layout. None of it has been checked by an attorney, so the page says
            so before anyone reads a statute citation as current law.
          */}
          <p
            role="note"
            className="mt-4 max-w-2xl rounded-[var(--radius-control)] border border-[color:var(--line-strong)] bg-[color:var(--surface-sunken)] px-3 py-2.5 text-[13px] leading-relaxed text-[color:var(--ink)]"
          >
            <strong className="font-bold">These updates are samples, not legal guidance.</strong>{" "}
            They show how change notices will look. The citations, dates, and amounts have not been
            reviewed. Don&apos;t rely on them in a case.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-4">
          {contentUpdates.map((update, index) => (
            <UpdateCard key={update.id} update={update} lead={index === 0} onOpen={openItemById} />
          ))}
        </div>
      </div>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? savedLearning.isSaved(selectedItem) : false}
        onToggleSaved={savedLearning.toggleSaved}
      />
    </>
  );
}
