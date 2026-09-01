"use client";

import { Check } from "lucide-react";

/**
 * Storyboard frame 06: feedback plus the new information the choice unlocked.
 */
export function FeedbackPanel({
  heading,
  body,
  confirmation,
  reveal,
  onContinue,
  continueLabel = "Continue",
}: {
  heading: string;
  body: string;
  confirmation: string;
  reveal?: { speaker: string; lines: string[] };
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <div className="w-full max-w-[680px]">
      <h2 className="text-[22px] font-semibold text-[#1c1c1c]">{heading}</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[#3d434b]">{body}</p>

      <div className="mt-4 flex items-center gap-2.5 border-b border-[#e3e2df] pb-4">
        <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#1fa06a]">
          <Check size={13} strokeWidth={3.5} color="#fff" />
        </span>
        <span className="text-[14px] text-[#1fa06a]">{confirmation}</span>
      </div>

      {reveal && (
        <div className="mt-4">
          <div className="text-[13px] font-medium text-[#2f6098]">{reveal.speaker}</div>
          {reveal.lines.map((line, i) => (
            <p key={i} className="mt-1 text-[14.5px] leading-relaxed text-[#1c1c1c]">
              {line}
            </p>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 rounded-lg bg-[#2f6098] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#27507f]"
      >
        {continueLabel}
      </button>
    </div>
  );
}
