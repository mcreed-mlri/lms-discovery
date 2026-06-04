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
          <p className="section-kicker secondary">Keep current</p>
          <h1 className="section-title mt-1 text-2xl text-[color:var(--ink)]">Updates</h1>
          <p className="mt-2 text-[color:var(--ink-muted)]">Recent changes to modules, checklists, and practice guidance.</p>
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
