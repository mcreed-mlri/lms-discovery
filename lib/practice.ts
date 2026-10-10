/* Practice drills: a safe place to rehearse a skill before court. This is the
   scripted stage (PRODUCT.md, "Practice and Simulation"): every prompt and
   every piece of coaching is written ahead of time, nothing is generated, and
   nothing the learner types is stored unless they save a note.

   Wording is taken from the Hearsay course package (fact pattern, objection,
   self-review checklist, procedure steps, hint and sample analysis) wherever
   the course has it. The one exception is round 2's pushback, which the course
   does not script; it is marked `reviewed: false` and labelled on screen.

   Pure data, no "use client", so the route's generateStaticParams can read it. */

export type ChecklistPoint = {
  /** The self-review question, as the learner sees it. */
  question: string;
  /** What the point is, as a short past-tense label for the coaching list. */
  label: string;
  /** Shown when the learner leaves the point unchecked. */
  coaching: string;
};

export type PracticeRound = {
  speaker: "Opposing counsel" | "The judge";
  prompt: string;
  /** False when the prompt was written for the hub, not taken from the course. */
  reviewed: boolean;
  placeholder: string;
  checklist: ChecklistPoint[];
};

export type PracticeDrill = {
  id: string;
  binderId: string;
  tabId: string;
  title: string;
  summary: string;
  /** Suggested minutes per written response, from the course. */
  suggestedMinutes: number;
  facts: string;
  excerpt: string;
  rounds: PracticeRound[];
  procedure: string[];
  draftingFrame: string;
  sampleAnalysis: string;
  courseTitle: string;
  courseHref: string;
};

const HEARSAY_SKILL_2 = "/legal-skills-hearsay/defending-hearsay-objection-writing.html";

export const practiceDrills: PracticeDrill[] = [
  {
    id: "hearsay-objection-in-writing",
    binderId: "litigation",
    tabId: "trial-skills",
    title: "Answer a hearsay objection in writing",
    summary:
      "Opposing counsel objects to a declaration as layered hearsay. Write your response, check it against the course’s checklist, then answer the pushback.",
    suggestedMinutes: 8,
    facts:
      "A supervisor declaration quotes an intake worker’s note that a client called to report a missed deadline notice. The declaration is attached to a written request to admit the timeline evidence.",
    excerpt:
      "“The intake worker documented that the client said no notice was received before April 12.”",
    rounds: [
      {
        speaker: "Opposing counsel",
        prompt: "“This is layered hearsay and should be excluded.”",
        reviewed: true,
        placeholder: "Start by naming the challenged statement and the purpose it’s offered for…",
        checklist: [
          {
            question: "Did your response identify the challenged statement?",
            label: "Named the challenged statement",
            coaching: "Identify the challenged statement. Quote or describe it precisely.",
          },
          {
            question: "Did it explain the purpose for which the statement is offered?",
            label: "Explained the purpose it’s offered for",
            coaching:
              "State the purpose for which the evidence is offered. Do not skip this step. If the statement is not offered to prove the truth of what it asserts, the response may begin outside hearsay.",
          },
          {
            question: "Did it identify a possible exclusion or exception?",
            label: "Found an exclusion or exception",
            coaching:
              "Identify the applicable exclusion or exception. Layered statements require analysis of each layer.",
          },
          {
            question: "Did it connect the facts to the legal rule?",
            label: "Connected the facts to the rule",
            coaching: "Connect the relevant facts to the rule. Show why this record fits.",
          },
          {
            question: "Did it clearly request admission of the evidence?",
            label: "Asked for admission",
            coaching: "State clearly why the evidence should be admitted. End with the request.",
          },
        ],
      },
      {
        speaker: "Opposing counsel",
        prompt:
          "“Even if the note itself is offered only to show when the office learned of the problem, the client’s statement inside it is offered for its truth. Counsel hasn’t addressed that layer.”",
        reviewed: false,
        placeholder:
          "Address the inner layer. Start with the purpose the client’s statement is offered for…",
        checklist: [
          {
            question: "Did you state the purpose for which the client’s statement is offered?",
            label: "Gave the client’s statement a purpose",
            coaching:
              "Start with purpose. If the statement is not offered to prove the truth of what it asserts, the response may begin outside hearsay.",
          },
          {
            question: "Did you give the client’s statement its own route to admission?",
            label: "Gave the inner layer its own route",
            coaching:
              "Layered statements require analysis of each layer: a non-hearsay theory, an exclusion or an exception for each one.",
          },
          {
            question: "Did you tie the facts of this record to that route?",
            label: "Tied this record’s facts to that route",
            coaching: "Connect the relevant facts to the rule. Show why this record fits.",
          },
        ],
      },
    ],
    procedure: [
      "Identify the challenged statement.",
      "State the purpose for which the evidence is offered.",
      "Identify the applicable exclusion or exception.",
      "Connect the facts to the rule.",
      "Request admission clearly.",
    ],
    draftingFrame:
      "“The challenged statement is offered to ________. It is not hearsay because ________. Alternatively, it is admissible under ________ because ________.”",
    sampleAnalysis:
      "A strong response would identify the layered statement, explain the purpose for offering it, and then address each layer through a non-hearsay theory, exclusion, or exception after legal authority is reviewed by a subject-matter expert.",
    courseTitle: "Legal Skills: Hearsay",
    courseHref: HEARSAY_SKILL_2,
  },
];

export function getDrill(id: string): PracticeDrill | undefined {
  return practiceDrills.find((drill) => drill.id === id);
}

export function getDrillsForTab(tabId: string): PracticeDrill[] {
  return practiceDrills.filter((drill) => drill.tabId === tabId);
}

export function drillHref(drill: PracticeDrill): string {
  return `/binder/${drill.binderId}/${drill.tabId}/practice/${drill.id}`;
}
