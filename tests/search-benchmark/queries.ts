/* The search benchmark: questions as an advocate would type them, each with the
   answers that count as right. A subject-matter expert should own this list.
   Replace these starter questions with real ones from attorneys and
   supervisors, and add every zero-result search worth answering.

   An answer is "Kind: Title", exactly as the dropdown shows it. Kinds:
   Reference, Practice, Lesson, Topic (binder hits) and Course, Module, Path
   (library). Any listed answer in the top 3 counts as a pass.

   `knownGap` marks a question search cannot answer yet, with the reason. It is
   reported but does not fail the build. When a fix lands, the test says so and
   the gap must be removed, so the list stays honest. */

export type BenchmarkQuery = {
  query: string;
  answers: string[];
  /** Why this question matters, in one line. */
  why: string;
  knownGap?: string;
};

export const benchmarkQueries: BenchmarkQuery[] = [
  // Hearsay: the pilot, filed under Litigation › Trial › Objections.
  {
    query: "hearsay objection",
    answers: [
      "Reference: Procedure: answering a hearsay objection in writing",
      "Lesson: Defending against a hearsay objection in writing",
      "Practice: Answer a hearsay objection in writing",
    ],
    why: "The pilot's core skill, in its own words.",
  },
  {
    query: "how do I respond to a hearsay objection",
    answers: [
      "Reference: Procedure: answering a hearsay objection in writing",
      "Lesson: Defending against a hearsay objection in writing",
    ],
    why: "A question, not keywords: filler words must not sink it.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "opposing counsel says my declaration is hearsay",
    answers: [
      "Lesson: Defending against a hearsay objection in writing",
      "Practice: Answer a hearsay objection in writing",
      "Reference: Procedure: answering a hearsay objection in writing",
    ],
    why: "The situation, described the way it happens.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "layered hearsay",
    answers: [
      "Practice: Answer a hearsay objection in writing",
      "Reference: Hearsay: key concepts",
    ],
    why: "A doctrine term the drill is built around.",
  },
  {
    query: "hearsay exceptions",
    answers: ["Reference: Hearsay: key concepts"],
    why: "Quick reference, not the whole course.",
    knownGap: "The reference page is indexed by its title only; its contents are not searchable.",
  },
  {
    query: "practice answering an objection",
    answers: ["Practice: Answer a hearsay objection in writing"],
    why: "Someone looking to rehearse, not read.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "heresay",
    answers: [
      "Reference: Hearsay: key concepts",
      "Reference: Procedure: answering a hearsay objection in writing",
      "Lesson: Defending against a hearsay objection in writing",
      "Course: Legal Skills: Hearsay",
    ],
    why: "The common misspelling.",
  },
  {
    query: "Mass. G. Evid. 801",
    answers: ["Reference: Hearsay: key concepts", "Topic: Objections"],
    why: "Lawyers search by rule number.",
    knownGap: "Rule and citation numbers are not recognised yet.",
  },
  {
    query: "objections",
    answers: ["Topic: Objections"],
    why: "The topic page itself.",
  },
  {
    query: "drafting frame",
    answers: ["Reference: Procedure: answering a hearsay objection in writing"],
    why: "A named piece inside a reference page.",
  },

  // Eviction defense: built, but not in a binder yet (library only).
  {
    query: "notice to quit",
    answers: [
      "Module: The Four Notice Types",
      "Module: When the Clock Starts",
      "Course: Eviction Defense: The First 48 Hours",
    ],
    why: "The placeholder example on Home's search box.",
  },
  {
    query: "14-day notice",
    answers: ["Module: The Four Notice Types"],
    why: "How the notice is usually named.",
  },
  {
    query: "client got a notice to quit what is the deadline",
    answers: ["Module: When the Clock Starts"],
    why: "The just-in-time question PRODUCT.md is built around.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "how many days to answer an eviction",
    answers: ["Module: When the Clock Starts", "Module: Drafting the Answer"],
    why: "Deadline question in plain words.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "landlord served the notice wrong",
    answers: ["Module: Service of Process Checklist"],
    why: "Service problem described as a situation.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "summary process answer",
    answers: ["Module: Drafting the Answer"],
    why: "Massachusetts name for an eviction case.",
    knownGap: "No synonym links summary process to eviction.",
  },
  {
    query: "G.L. c. 239",
    answers: ["Course: Eviction Defense: The First 48 Hours", "Module: The Four Notice Types"],
    why: "The summary process statute, by citation.",
    knownGap: "Citations are not recognised yet.",
  },
  {
    query: "first day in housing court",
    answers: ["Module: Walking into Housing Court"],
    why: "Preparing for a first appearance.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "eviction intake call",
    answers: ["Module: Intake Scenario: The First Call"],
    why: "A practice scenario by what it is.",
  },
  {
    query: "NTQ",
    answers: ["Module: The Four Notice Types", "Module: When the Clock Starts"],
    why: "The everyday abbreviation.",
    knownGap: "No legal-aid abbreviation list yet.",
  },
  {
    query: "no fault eviction",
    answers: ["Module: The Four Notice Types"],
    why: "One of the four notice types.",
  },

  // Finding your way around the hub.
  {
    query: "how do I find my assigned courses",
    answers: ["Course: Welcome to the Learning Hub"],
    why: "First-week orientation.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "where does my training fit",
    answers: ["Course: Curriculum Map"],
    why: "Orientation to the curriculum.",
    knownGap: "Every word must match, so filler words (how, do, my, the) sink a question.",
  },
  {
    query: "new attorney training",
    answers: ["Path: Legal Skills for New Attorneys"],
    why: "The path for the primary audience.",
    knownGap: "No synonym links training to course or path.",
  },

  // Planned topics: the honest answer is the planned module or topic.
  {
    query: "discovery",
    answers: ["Module: Discovery"],
    why: "A planned topic should still be findable.",
  },
  {
    query: "jury selection",
    answers: ["Module: Jury Selection"],
    why: "A planned topic by name.",
  },
  {
    query: "rules of professional conduct",
    answers: ["Module: MA Rules of Prof. Conduct"],
    why: "The full name of an abbreviated title.",
    knownGap: "The title abbreviates Professional to Prof., and nothing expands it.",
  },
  {
    query: "conflict check",
    answers: ["Module: Conflict Checks"],
    why: "Singular of a planned topic.",
  },
];
