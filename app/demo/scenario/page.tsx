"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { CaseNotesPanel } from "@/components/scenario/CaseNotesPanel";
import { ChoiceStep } from "@/components/scenario/ChoiceStep";
import { FeedbackPanel } from "@/components/scenario/FeedbackPanel";
import { Narration } from "@/components/scenario/Narration";
import { Bookend } from "@/components/scenario/Bookend";
import { PhoneCall, type CallLine } from "@/components/scenario/PhoneCall";
import type { ScenarioChoice, ScenarioFact } from "@/components/scenario/types";
import { PdfReaderApp } from "@/components/workspace/apps/PdfReaderApp";
import { defaultWorkspaceHost, pdfDocuments } from "@/components/workspace";
import type { WorkspaceCompletion } from "@/components/workspace";

/**
 * Interactive eviction-intake scenario.
 *
 * PLACEHOLDER LEGAL CONTENT - every legal statement here needs attorney
 * review before a learner sees it.
 */

const FACTS: ScenarioFact[] = [
  {
    id: "received",
    label: "Notice received: May 20, 2024",
    pendingLabel: "Notice received: ?",
    revealedBy: "call",
  },
  {
    id: "deadline",
    label: "Move-out deadline: May 31, 2024",
    pendingLabel: "Move-out deadline: ?",
    revealedBy: "call",
  },
  {
    id: "reason",
    label: "Reason given: Renovations / Landlord moving in",
    pendingLabel: "Reason given: ?",
    revealedBy: "call",
  },
  {
    id: "type",
    label: "Type of notice: Notice to Vacate",
    pendingLabel: "Type of notice: ?",
    revealedBy: "notice",
  },
  {
    id: "term",
    label: "Lease term: 9/1/23 - 8/31/24",
    pendingLabel: "Lease term: ?",
    revealedBy: "lease-doc",
  },
  {
    id: "rent",
    label: "Rent amount: $1,450 / month",
    pendingLabel: "Rent amount: ?",
    revealedBy: "lease-doc",
  },
];

// audioId maps to public/audio/<id>.mp3. The client and the advocate are
// voiced separately (see scripts/voiceover.json), so keep the text here in
// sync with the manifest.
const CALL_LINES: CallLine[] = [
  {
    who: "Client",
    audioId: "call-0",
    text: "Hi, I need some help. I just got a notice from my landlord.",
  },
  {
    who: "You",
    audioId: "call-1",
    text: "I'm here to help. Can you tell me more about it?",
  },
  {
    who: "Client",
    audioId: "call-2",
    text: "He says I have to move out by the end of the month.",
    revealsFact: "deadline",
  },
  { who: "You", audioId: "call-3", text: "Do you know why?" },
  {
    who: "Client",
    audioId: "call-4",
    text: "He says he's renovating and moving in.",
    revealsFact: "reason",
  },
  {
    who: "Client",
    audioId: "call-5",
    text: "He gave me this yesterday.",
    revealsFact: "received",
  },
];

const CHOICES: ScenarioChoice[] = [
  {
    id: "moved-in",
    label: "Ask about when the tenant moved in.",
    correct: false,
    feedback: "Useful eventually, but it does not tell you whether the notice itself was valid.",
  },
  {
    id: "lease",
    label: "Ask if they have a lease.",
    correct: true,
    feedback:
      "Asking about a lease helps you understand the tenant's rights and whether proper notice was given.",
  },
  {
    id: "healing",
    label: "Explain their right to healing time.",
    correct: false,
    feedback: "Too early - you do not yet know what type of notice this is.",
  },
  {
    id: "appointment",
    label: "Schedule an in-person appointment.",
    correct: false,
    feedback: "This defers the intake. You can still gather key facts on this call.",
  },
];

type Step =
  "intro" | "call" | "notice" | "choice" | "feedback" | "lease-doc" | "lease" | "complete";

// Drop your Unsplash photos at these paths. Missing files fall back to a
// gradient, so the scenario looks intentional before the art arrives.
const OPENING_IMAGE = "/images/desk-morning.jpg";
const CLOSING_IMAGE = "/images/desk-evening.jpg";

const NOTICE_ID = "notice-to-vacate";
const LEASE_ID = "lease-agreement";

export default function ScenarioPage() {
  const [step, setStep] = useState<Step>("intro");
  // Empty to begin with: every fact is earned from the call or the documents.
  const [known, setKnown] = useState<Set<string>>(() => new Set());
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [callDone, setCallDone] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  const log = (line: string) => setEvents((prev) => [line, ...prev].slice(0, 8));

  const reveal = (ids: string[]) => {
    setKnown((prev) => new Set([...prev, ...ids]));
    setJustAdded(ids[ids.length - 1] ?? null);
  };

  const chosen = CHOICES.find((c) => c.id === picked);

  // The workspace kit reports learner actions through this one callback.
  const host = {
    ...defaultWorkspaceHost,
    userName: "Intake Advocate",
    organizationName: "Harborside Legal Aid",
    onNudge: (message: string) => log(`nudge: ${message}`),
    onComplete: (event: WorkspaceCompletion) =>
      log(`complete: ${event.appKey} / ${event.action} / ${event.label ?? ""}`),
  };

  const notice = pdfDocuments.filter((d) => d.id === NOTICE_ID);
  const lease = pdfDocuments.filter((d) => d.id === LEASE_ID);

  // Frames 01 and 09 run full width with no case notes, as in the storyboard.
  const isBookend = step === "intro" || step === "complete";
  // The call panel supplies its own dark chrome, so skip the white card.
  const isFullBleed = isBookend || step === "call";

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="mx-auto max-w-[1180px] px-6 py-8">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-wider text-[#8a8f96]">
              Scenario 1
            </div>
            <h1 className="text-[19px] font-semibold text-[#1c1c1c]">A client calls your office</h1>
          </div>
          {step !== "call" && <Narration stepId={step} />}
        </header>

        <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
          <main
            className={
              isFullBleed
                ? "min-w-0 flex-1"
                : "min-w-0 flex-1 rounded-xl border border-[#e3e2df] bg-white p-7"
            }
          >
            {step === "intro" && (
              <Bookend image={OPENING_IMAGE} imageAlt="A desk in a legal aid office, early morning">
                <div className="rounded-md bg-black/45 px-3 py-2 backdrop-blur-sm">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    Tuesday
                  </div>
                  <div className="text-[26px] font-light leading-tight text-white">9:14 AM</div>
                </div>
                <h2 className="max-w-[16em] text-[34px] font-semibold leading-[1.15] text-white">
                  A client calls your office.
                </h2>
                <Next onClick={() => setStep("call")}>Take the call</Next>
              </Bookend>
            )}

            {step === "call" && (
              <div>
                <PhoneCall
                  callerName="Client"
                  lines={CALL_LINES}
                  onRevealFact={(id) => reveal([id])}
                  onFinished={() => setCallDone(true)}
                />
                {callDone && <Next onClick={() => setStep("notice")}>Open the document</Next>}
              </div>
            )}

            {step === "notice" && (
              <div>
                <h2 className="text-[20px] font-semibold text-[#1c1c1c]">
                  Document from the client
                </h2>
                <p className="mt-1 text-[14px] text-[#6f7680]">
                  Read the notice. What type of notice is this?
                </p>
                <DocumentFrame>
                  <PdfReaderApp
                    host={host}
                    documents={notice}
                    initialId={NOTICE_ID}
                    initialZoom={70}
                    showSidebar={false}
                  />
                </DocumentFrame>
                <Next
                  onClick={() => {
                    reveal(["type"]);
                    setStep("choice");
                    log("event: notice-reviewed");
                  }}
                >
                  Log it as a Notice to Vacate
                </Next>
              </div>
            )}

            {step === "choice" && (
              <ChoiceStep
                prompt="What would you like to do next?"
                subPrompt="Choose the best next step."
                choices={CHOICES}
                picked={picked}
                onPick={(choice) => {
                  setPicked(choice.id);
                  setJustAdded(null);
                  log(`choice: ${choice.id} (${choice.correct ? "correct" : "incorrect"})`);
                  setStep("feedback");
                }}
              />
            )}

            {step === "feedback" && chosen && (
              <FeedbackPanel
                heading={chosen.correct ? "Good choice." : "Not quite."}
                body={chosen.feedback}
                confirmation={`You selected: ${chosen.label}`}
                reveal={
                  chosen.correct
                    ? {
                        speaker: "Client",
                        lines: [
                          "Yes, here it is. It is a one-year lease that started last September.",
                        ],
                      }
                    : undefined
                }
                continueLabel={chosen.correct ? "Open the lease" : "Continue anyway"}
                onContinue={() => setStep("lease-doc")}
              />
            )}

            {step === "lease-doc" && (
              <div>
                <h2 className="text-[20px] font-semibold text-[#1c1c1c]">The lease</h2>
                <p className="mt-1 text-[14px] text-[#6f7680]">
                  Find the lease term and the monthly rent.
                </p>
                <DocumentFrame>
                  <PdfReaderApp
                    host={host}
                    documents={lease}
                    initialId={LEASE_ID}
                    initialZoom={70}
                    showSidebar={false}
                  />
                </DocumentFrame>
                <Next
                  onClick={() => {
                    reveal(["term", "rent"]);
                    setStep("lease");
                    log("event: lease-reviewed");
                  }}
                >
                  Add these to my case notes
                </Next>
              </div>
            )}

            {step === "lease" && (
              <div className="max-w-[640px]">
                <h2 className="text-[20px] font-semibold text-[#1c1c1c]">Important dates</h2>
                <Timeline />
                <div className="mt-5 rounded-lg border border-[#cfe9db] bg-[#f0faf5] px-4 py-3.5 text-[14px] leading-relaxed text-[#1c4a35]">
                  This notice may not meet the required notice period for this type of eviction in
                  your state.
                  <span className="mt-1 block text-[12.5px] italic text-[#5c7a6b]">
                    Placeholder - requires attorney review.
                  </span>
                </div>
                <Next onClick={() => setStep("complete")}>Finish scenario</Next>
              </div>
            )}

            {step === "complete" && (
              <Bookend
                image={CLOSING_IMAGE}
                imageAlt="A desk in a legal aid office at the end of the day"
                align="center"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1fa06a]">
                    <Check size={18} strokeWidth={3} color="#fff" />
                  </span>
                  <h2 className="text-[30px] font-semibold text-white">Scenario Complete</h2>
                </div>

                <p className="text-[15px] text-white/80">
                  You identified key facts and took the right steps.
                </p>

                <div className="rounded-lg bg-black/50 px-6 py-5 text-left backdrop-blur-sm">
                  <div className="text-[13px] font-medium text-white/70">You have learned:</div>
                  <ul className="mt-2.5 flex flex-col gap-1.5 text-[14px] text-white">
                    {[
                      "How to gather important information",
                      "How to identify the type of notice",
                      "How to support the client's next steps",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check
                          size={14}
                          strokeWidth={3}
                          color="#4ade80"
                          className="mt-1 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("intro");
                    setKnown(new Set());
                    setCallDone(false);
                    setJustAdded(null);
                    setPicked(null);
                    log("event: scenario-restarted");
                  }}
                  className="rounded-lg bg-white/95 px-5 py-2.5 text-[14px] font-medium text-[#1c1c1c] hover:bg-white"
                >
                  Replay scenario
                </button>
              </Bookend>
            )}
          </main>

          {!isBookend && <CaseNotesPanel facts={FACTS} known={known} justAdded={justAdded} />}
        </div>

        <div className="mt-7 font-mono text-[12px] text-[#8a8f96]">
          <div className="mb-1">scoring events</div>
          {events.length === 0 ? <div>none yet</div> : events.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      </div>
    </div>
  );
}

/**
 * The PDF reader fills its container, so a document step needs a definite
 * height. Without this the reader collapses to its content height.
 */
function DocumentFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex h-[540px] flex-col overflow-hidden rounded-lg border border-[#dadce0]">
      {children}
    </div>
  );
}

function Next({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 rounded-lg bg-[#2f6098] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#27507f]"
    >
      {children}
    </button>
  );
}

function Timeline() {
  const points = [
    { date: "Sep 1, 2023", label: "Lease start" },
    { date: "May 20, 2024", label: "Notice received", active: true },
    { date: "May 31, 2024", label: "Move-out deadline" },
    { date: "Aug 31, 2024", label: "Lease end" },
  ];
  return (
    <div className="mt-5">
      <div className="relative h-[2px] bg-[#e3e2df]">
        {points.map((p, i) => (
          <span
            key={p.date}
            className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
              p.active ? "bg-[#2f6098]" : "bg-[#cfcfcb]"
            }`}
            style={{ left: `${(i / (points.length - 1)) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[12px]">
        {points.map((p) => (
          <div key={p.date} className="max-w-[90px]">
            <div className={p.active ? "font-medium text-[#1c1c1c]" : "text-[#6f7680]"}>
              {p.date}
            </div>
            <div className="text-[#8a8f96]">{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
