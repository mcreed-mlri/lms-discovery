/** A fact the learner extracts from the call or the documents. */
export interface ScenarioFact {
  id: string;
  /** Label once the fact is known. */
  label: string;
  /** Label while still unknown, e.g. "Type of notice: ?" */
  pendingLabel: string;
  /** Which step reveals this fact. */
  revealedBy: string;
}

/** One option in a "what would you do next?" step. */
export interface ScenarioChoice {
  id: string;
  label: string;
  correct: boolean;
  /** Shown after the learner picks this option. */
  feedback: string;
}
