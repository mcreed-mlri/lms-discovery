"use client";

import { CalendarDays, FileText, Scale, Users } from "lucide-react";
import type { ScenarioChoice } from "./types";

const ICONS = [CalendarDays, FileText, Scale, Users];

/**
 * Storyboard frame 05: "What would you like to do next?"
 *
 * This is the part a linear video cannot do - the learner actually picks,
 * and the pick drives both feedback and scoring.
 */
export function ChoiceStep({
  prompt,
  subPrompt,
  choices,
  onPick,
  picked,
}: {
  prompt: string;
  subPrompt?: string;
  choices: ScenarioChoice[];
  onPick: (choice: ScenarioChoice) => void;
  picked?: string | null;
}) {
  return (
    <div className="w-full max-w-[680px]">
      <h2 className="text-[22px] font-semibold text-[#1c1c1c]">{prompt}</h2>
      {subPrompt && <p className="mt-1 text-[14px] text-[#6f7680]">{subPrompt}</p>}

      <ul className="mt-5 flex flex-col gap-2.5">
        {choices.map((choice, i) => {
          const Icon = ICONS[i % ICONS.length];
          const isPicked = picked === choice.id;
          const settled = Boolean(picked);
          return (
            <li key={choice.id}>
              <button
                type="button"
                disabled={settled}
                onClick={() => onPick(choice)}
                className={`flex w-full items-center gap-3.5 rounded-lg border px-4 py-3.5 text-left transition-colors ${
                  isPicked
                    ? choice.correct
                      ? "border-[#1fa06a] bg-[#f0faf5]"
                      : "border-[#d97706] bg-[#fffbeb]"
                    : settled
                      ? "border-[#e3e2df] bg-white opacity-55"
                      : "border-[#e3e2df] bg-white hover:border-[#2f6098] hover:bg-[#f7fafd]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#eef2f7]">
                  <Icon size={17} color="#2f6098" />
                </span>
                <span className="text-[14.5px] text-[#1c1c1c]">{choice.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
