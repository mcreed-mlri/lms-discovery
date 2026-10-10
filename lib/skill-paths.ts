/* Skill paths: a skill taught the 4C/ID way (docs/learning-design.md). A path
   has levels (task classes), simple to complex. Each level runs Watch (a
   worked example), Help (a completion task) and Solo (the whole task alone),
   and quick drills make the basics automatic. Levels not built yet are listed
   as coming, so the whole ladder is visible.

   All legal content here is prototype content for the Hearsay pilot, not yet
   reviewed by a subject-matter expert, and says so on screen.

   Pure data, no "use client", so routes' generateStaticParams can read it. */

import { BINDER_ROOT } from "@/lib/binder";
import { drillHref, getDrill } from "@/lib/practice";

export type StepKind = "watch" | "help" | "solo";

export type AnnotatedSentence = {
  text: string;
  /** Which step of the procedure the sentence does. */
  step: string;
  why: string;
  mistake: string;
};

export type WatchStep = {
  intro: string;
  caseFile: string;
  sentences: AnnotatedSentence[];
};

export type HelpStep = {
  intro: string;
  caseFile: string;
  /** Steps the expert already wrote, in order. */
  given: string[];
  /** Steps the learner writes, numbered after `given`. */
  tasks: { label: string; placeholder: string; expert: string }[];
  hints: string[];
  checklist: string[];
};

export type SkillLevel = {
  n: number;
  title: string;
  what: string;
  /** Built levels have their steps; coming levels only describe them. */
  watch?: WatchStep;
  help?: HelpStep;
  /** The practice drill (lib/practice.ts) that is this level's Solo step. */
  soloDrillId?: string;
  coming?: { watch: string; help: string; solo: string };
};

export type QuickDrillItem = {
  setting: string;
  text: string;
  hearsay: boolean;
  why: string;
};

export type QuickDrill = {
  id: string;
  title: string;
  summary: string;
  items: QuickDrillItem[];
};

export type SkillPath = {
  id: string;
  title: string;
  summary: string;
  binderId: string;
  tabId: string;
  topicId: string;
  levels: SkillLevel[];
  drills: QuickDrill[];
};

export const skillPaths: SkillPath[] = [
  {
    id: "hearsay",
    title: "Hearsay",
    summary:
      "Defend against a hearsay objection. Four levels, each harder than the last. In every level you watch an expert, finish one with help, then do it solo.",
    binderId: "litigation",
    tabId: "trial-skills",
    topicId: "objections",
    levels: [
      {
        n: 1,
        title: "In writing, one statement",
        what: "A declaration quotes one out-of-court statement.",
        watch: {
          intro:
            "Opposing counsel objects to a supervisor’s declaration as hearsay. Read the expert’s written response. Choose any sentence to see why it is there.",
          caseFile:
            "A supervisor’s declaration quotes an intake worker’s note that the client called on April 12 to report she never received a notice. Opposing counsel objects to paragraph 4 as hearsay.",
          sentences: [
            {
              text: "Opposing counsel objects to the intake worker’s note quoted in paragraph 4 of the declaration.",
              step: "Step 1: name the statement",
              why: "The judge has to know exactly which words are in dispute. Naming the paragraph keeps the argument narrow.",
              mistake: "arguing about the whole declaration instead of the one statement.",
            },
            {
              text: "The note is offered to show that the client reported a missing notice on April 12, not to prove that no notice was sent.",
              step: "Step 2: state the purpose",
              why: "Hearsay depends on purpose. If the statement is not offered for its truth, the objection can fail right here.",
              mistake: "skipping the purpose and going straight to exceptions.",
            },
            {
              text: "Offered for that purpose, it is not hearsay.",
              step: "Step 3: say whether it is hearsay",
              why: "State the conclusion plainly before arguing anything else. It frames everything that follows.",
              mistake: "burying the conclusion at the end.",
            },
            {
              text: "Alternatively, the note is a record of a regularly conducted activity, made at the time by an employee whose job was to record client calls.",
              step: "Step 4: an exception, in the alternative",
              why: "Give the court a second route in case it disagrees about purpose, and tie each element to these facts.",
              mistake: "naming an exception without connecting it to the facts.",
            },
            {
              text: "The court should admit paragraph 4 for the limited purpose of showing notice.",
              step: "Step 5: ask clearly",
              why: "End with exactly what you want the court to do, including any limit on the purpose.",
              mistake: "forgetting to make a clear request.",
            },
          ],
        },
        help: {
          intro: "New facts, same skill. The expert wrote steps 1 to 3. You write steps 4 and 5.",
          caseFile:
            "A property manager’s affidavit attaches a maintenance log entry: “Tenant called, said the heat has been off since Monday.” Opposing counsel objects that the entry is hearsay.",
          given: [
            "The objection concerns the log entry attached as Exhibit B.",
            "It is offered to show the landlord was told about the heat, not to prove the heat was off.",
            "Offered for notice, it is not hearsay.",
          ],
          tasks: [
            {
              label: "Give the court a second route",
              placeholder: "Alternatively, the entry is admissible because…",
              expert:
                "Alternatively, the entry is a business record: made at the time, in the regular course of managing the building, by staff whose job was to log maintenance calls.",
            },
            {
              label: "Ask the court for what you want",
              placeholder: "The court should…",
              expert:
                "The court should admit Exhibit B for the limited purpose of showing the landlord had notice of the heating problem.",
            },
          ],
          hints: [
            "Step 4 is your second route, in case the court disagrees about purpose. Which exception fits a log kept in the ordinary course of business?",
            "Step 5: say exactly what you want the court to do, and limit the purpose to notice.",
          ],
          checklist: [
            "Did step 4 name an exception and connect each element to these facts?",
            "Did step 5 ask for a ruling, and limit the purpose to notice?",
          ],
        },
        soloDrillId: "hearsay-objection-in-writing",
      },
      {
        n: 2,
        title: "In writing, layered hearsay",
        what: "A statement inside a statement. Analyse each layer.",
        coming: {
          watch: "An expert takes each layer",
          help: "You do layer two",
          solo: "Answer the pushback",
        },
      },
      {
        n: 3,
        title: "At a hearing",
        what: "Out loud, and the judge interrupts.",
        coming: {
          watch: "An expert argues it",
          help: "Choose at key moments",
          solo: "Argue it to the judge",
        },
      },
      {
        n: 4,
        title: "Strategy",
        what: "Several routes, and the client’s goal decides.",
        coming: {
          watch: "An expert weighs options",
          help: "Pick from three routes",
          solo: "A full scenario",
        },
      },
    ],
    drills: [
      {
        id: "hearsay-or-not",
        title: "Hearsay or not?",
        summary: "Six quick calls. The ones you miss come back at the end.",
        items: [
          {
            setting: "Eviction trial",
            text: "The tenant testifies: “My neighbor told me the landlord changed the locks.”",
            hearsay: true,
            why: "Offered to prove the locks were changed, and the neighbor said it out of court. Hearsay unless an exception applies.",
          },
          {
            setting: "Eviction trial",
            text: "To show the landlord knew about the leak, the tenant testifies: “I told the landlord the ceiling was leaking.”",
            hearsay: false,
            why: "Offered to show notice, not that the ceiling was leaking. Not hearsay for that purpose.",
          },
          {
            setting: "Protective order hearing",
            text: "The petitioner testifies: “He said, ‘I’ll make you regret this.’”",
            hearsay: false,
            why: "A threat matters because it was said, not because it is true. It is not offered for its truth.",
          },
          {
            setting: "Benefits appeal",
            text: "A letter from a doctor who is not at the hearing, stating the client cannot work.",
            hearsay: true,
            why: "An out-of-court written statement offered to prove what it says. Hearsay; look for an exception or the forum’s own rules.",
          },
          {
            setting: "Eviction trial",
            text: "A maintenance log entry, “Tenant called, said heat off since Monday,” offered to prove the heat was off.",
            hearsay: true,
            why: "Layered: the log, and the tenant’s statement inside it. Offered for its truth, each layer needs its own route.",
          },
          {
            setting: "Family court",
            text: "A witness testifies that the child said “Good morning” to her at 7 a.m., to show the child was home.",
            hearsay: false,
            why: "The words show the child was there and speaking. They are not offered for the truth of “good morning.”",
          },
        ],
      },
    ],
  },
];

export const STEP_ORDER: StepKind[] = ["watch", "help", "solo"];

export const stepNames: Record<StepKind, string> = {
  watch: "Watch",
  help: "Help",
  solo: "Solo",
};

export function getSkillPath(id: string): SkillPath | undefined {
  return skillPaths.find((path) => path.id === id);
}

export function getSkillPathsForTopic(tabId: string, topicId: string): SkillPath[] {
  return skillPaths.filter((path) => path.tabId === tabId && path.topicId === topicId);
}

export function skillHref(path: SkillPath) {
  return `${BINDER_ROOT}/${path.binderId}/${path.tabId}/${path.topicId}/${path.id}`;
}

export function stepHref(path: SkillPath, level: SkillLevel, step: StepKind) {
  if (step === "solo") {
    const drill = level.soloDrillId ? getDrill(level.soloDrillId) : undefined;
    return drill ? drillHref(drill) : skillHref(path);
  }
  return `${skillHref(path)}/level-${level.n}/${step}`;
}

export function quickDrillHref(path: SkillPath, drill: QuickDrill) {
  return `${skillHref(path)}/drills/${drill.id}`;
}

/** Which steps a level has built, in order. */
export function builtSteps(level: SkillLevel): StepKind[] {
  return STEP_ORDER.filter((step) =>
    step === "watch" ? level.watch : step === "help" ? level.help : level.soloDrillId,
  );
}

/** The skill path and level whose Solo step is this practice drill, if any. */
export function findSoloLevel(drillId: string): { path: SkillPath; level: SkillLevel } | undefined {
  for (const path of skillPaths) {
    const level = path.levels.find((l) => l.soloDrillId === drillId);
    if (level) return { path, level };
  }
  return undefined;
}
