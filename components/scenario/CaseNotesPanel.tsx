"use client";

import { Check } from "lucide-react";
import type { ScenarioFact } from "./types";

/**
 * Storyboard frame 03: the case notes panel that fills in as the learner
 * gathers facts. Facts not yet known render as an empty box with a "?".
 *
 * `justAdded` highlights the fact that arrived on this step, which is the
 * cue the storyboard uses to draw the eye (frames 04 and 07).
 */
export function CaseNotesPanel({
  facts,
  known,
  justAdded,
}: {
  facts: ScenarioFact[];
  known: Set<string>;
  justAdded?: string | null;
}) {
  return (
    <aside className="w-full max-w-[420px] shrink-0 overflow-hidden rounded-xl border border-[#e3e2df] bg-white">
      <div className="border-b border-[#e3e2df] bg-[#f1f0ed] px-5 py-3.5">
        <h2 className="text-[15px] font-medium text-[#1c1c1c]">Case Notes</h2>
      </div>

      <div className="px-5 py-4">
        <h3 className="mb-3 text-[14px] font-bold text-[#1c1c1c]">Facts Identified</h3>

        <ul className="flex flex-col gap-2.5">
          {facts.map((fact) => {
            const isKnown = known.has(fact.id);
            const isNew = justAdded === fact.id;
            return (
              <li key={fact.id} className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors duration-300 ${
                    isKnown ? "border-[#1fa06a] bg-[#1fa06a]" : "border-[#cfcfcb] bg-white"
                  }`}
                >
                  {isKnown && <Check size={12} strokeWidth={3.5} color="#fff" />}
                </span>
                <span
                  className={`text-[13.5px] leading-snug transition-colors duration-300 ${
                    isKnown ? "text-[#1c1c1c]" : "text-[#8a8f96]"
                  } ${isNew ? "rounded bg-[#ffe9a3] px-1" : ""}`}
                >
                  {isKnown ? fact.label : fact.pendingLabel}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          disabled
          className="mt-4 cursor-default rounded-lg bg-[#2f6098] px-4 py-2 text-[13px] font-medium text-white opacity-60"
        >
          + Add note
        </button>
      </div>
    </aside>
  );
}
