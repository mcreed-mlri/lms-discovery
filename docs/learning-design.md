# Learning design: 4C/ID and CIT, made interactive

The team designs training with **4C/ID** (the Four-Component Instructional Design model, van Merriënboer) and **CIT** (read here as Flanagan's **Critical Incident Technique**; if the team means something else by CIT, this section needs revising). This document turns both into concrete, interactive things to build in the hub and in course packages. It pairs with `docs/simulations.md`, which covers the technology and safety side of practice.

**The short version:**

- **CIT tells you what to teach.** Experienced attorneys describe real moments where a new advocate did well or badly. Those moments become the tasks, the difficulty levels, the rubric and the scenario details.
- **4C/ID tells you how to teach it.** Learners do whole, realistic tasks from the start, getting harder over time, with support that fades. Information arrives in two kinds: the understanding behind the skill, and step-by-step how-to at the moment it's needed. Plus short drills for anything that must become automatic.
- **"Interactive" mostly means learners doing tasks, not clicking through content.** Most of it needs no AI at all.

## You are already doing it

The Hearsay course (`public/legal-skills-hearsay/`) maps onto 4C/ID almost exactly:

| Hearsay course step   | 4C/ID component                      | What makes it interactive                                 |
| --------------------- | ------------------------------------ | --------------------------------------------------------- |
| Review Key Concepts   | Supportive information               | Concept panels; could add "is this hearsay?" sorting      |
| Watch an Expert Model | Learning task: **worked example**    | The learner studies an expert doing the whole task        |
| Supported Practice    | Learning task: **completion task**   | The learner finishes a partly done response, with prompts |
| Rapid Practice        | **Part-task practice**               | Quick, repeated items with instant feedback               |
| Review the Procedure  | Procedural information               | Five steps and a drafting frame, open while working       |
| Independent Practice  | Learning task: **conventional task** | The whole task, no help, then feedback                    |

What 4C/ID adds beyond this: **task classes** (several versions of the whole task, from simple to complex, each with its own fading support), and **variability** (the same skill across different facts and settings).

## CIT: where the tasks come from

The Critical Incident Technique collects specific, real moments from people who know the work. For each incident, ask an experienced attorney or supervisor:

1. **What was the situation?** (Where, what stage of the case, what was at stake.)
2. **What exactly did the new advocate do or say?**
3. **What happened as a result?**
4. **Why was it effective, or not?**
5. **What would an experienced advocate have done?**

Collect 20 to 40 incidents per skill area, from several people, both good and bad. Then sort them:

| What you find in the incidents                                                             | What it becomes                                        |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Recurring situations                                                                       | **Learning tasks**: the whole tasks learners practise  |
| What made some situations harder (layered statements, a hostile judge, a client in crisis) | **Task classes**: the simple-to-complex sequence       |
| Effective and ineffective behaviours                                                       | **Rubric criteria** for feedback, human or AI          |
| Mistakes many people make                                                                  | **Part-task drills** and **"common mistake" feedback** |
| Surprising details (a fact the client didn't mention, a judge's typical question)          | **Hidden facts and escalations** in scenarios          |
| The questions advocates actually asked                                                     | **Search benchmark questions** (`docs/search.md`)      |

Keep incidents anonymous and fictionalised: no client names or identifying facts. CIT interviews are the same people and time you need for subject-matter review, so plan them together.

## The four components, and how to make each interactive

### 1. Learning tasks: the backbone

Whole, realistic tasks, from the first lesson. Not "learn the hearsay rule, then later apply it" but "respond to this objection" from day one, with plenty of help at first.

**Task classes.** Group tasks into levels of complexity, using the factors CIT surfaced. Learners finish one class before the next.

**Fading support within each class.** Every class starts with lots of help and ends with none:

| Support level         | What the learner does                  | Interactive formats                                                                                                                     |
| --------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Worked example**    | Studies an expert doing the whole task | Annotated model answer; click any sentence to see why the expert wrote it; a video or audio think-aloud; "predict the next move" pauses |
| **Completion task**   | Finishes a task an expert started      | Fill in the missing steps of a response; choose between options at key points; finish a drafting frame                                  |
| **Conventional task** | Does the whole task alone              | Write the full response; branching scenario with no hints; AI role-play (Level 3+ in `docs/simulations.md`)                             |

**Variability.** Within a class, change the surface: an affidavit in a housing case, a business record in a consumer case, a 911 call in a protective order hearing. Same skill, different facts, so learners learn the skill and not the example.

**Feedback after a task** compares the learner's reasoning to an expert's, not just right or wrong: "Here's how an experienced attorney approached the same objection."

### 2. Supportive information: the understanding behind the skill

For the parts of the task that need judgment (non-recurrent skills): how the domain works (mental models) and how experts approach problems (cognitive strategies). Given **before each task class** and available throughout.

**Interactive formats:**

- Concept panels the learner can open any time (the Hearsay Key Concepts panel).
- Sorting and classifying: "Is this hearsay? Why?" with explanations, not scores.
- A systematic approach shown as a walkable flowchart: "Is it a statement? Is it offered for its truth? Is there an exclusion?"
- Expert think-alouds: an attorney talking through a decision.
- "Explain your reasoning" prompts after a task, then the expert's reasoning to compare.

In the hub, this is the topic page's **Keep at hand** section and the course's reference panels.

### 3. Procedural information: step-by-step, just in time

For the parts of the task done the same way every time (recurrent skills): rules, steps, formats. Shown **at the moment it's needed**, during the task, then faded away.

**Interactive formats:**

- A procedure panel open beside the work (the Hearsay Procedure Reference).
- Step checklists the learner ticks while working (the practice room's self-review checklist).
- Hints on demand, which become harder to reach as the learner advances, and are gone in independent practice.
- Immediate corrective feedback on a procedural slip ("A notice to quit must state…").

### 4. Part-task practice: drills for automaticity

Only for recurrent skills that must become fast and error-free, and only after the whole task has been introduced. Short, frequent, repeated.

**Interactive formats:**

- Rapid-fire classification with instant feedback (the Hearsay Rapid Practice step).
- Deadline calculation drills: given notice dates, what is the deadline?
- Citation and form recall.
- Spaced repetition: a few items a day, returning to the ones the learner missed.

## Worked blueprint: Hearsay

**Task:** defend against a hearsay objection to a piece of evidence you want admitted.

| Task class                   | Complexity (from CIT)                              | Worked example                         | Completion task                     | Conventional task                                 |
| ---------------------------- | -------------------------------------------------- | -------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| 1. Written, single statement | Clear purpose; one obvious route to admission      | Expert's written response, annotated   | Finish a response missing steps 4–5 | Write the response (built: practice room round 1) |
| 2. Written, layered hearsay  | Statement within a statement; each layer analysed  | Expert analyses both layers            | Analyse layer two, given layer one  | Write it, answer the pushback (built: round 2)    |
| 3. Oral, at a hearing        | Time pressure; the judge interrupts                | Audio or video of an expert arguing it | Choose responses at key moments     | AI judge, text first, voice later                 |
| 4. Strategic                 | Several routes; consequences for the client's case | Expert weighs options aloud            | Pick and justify a route from three | Full scenario with a client goal                  |

- **Supportive information:** Key Concepts panel, the "is it hearsay?" flowchart, expert think-alouds. Before class 1; added to before class 3.
- **Procedural information:** Procedure Reference and drafting frame, open during classes 1–2, hint-only in class 3, gone in class 4.
- **Part-task practice:** "hearsay or not?" rapid classification, and exclusion and exception recall, between classes 1 and 2.

The five Hearsay subskills in the course (objecting and defending, in writing and orally, plus strategy) line up with these task classes.

## Worked blueprint: Eviction defense, first 48 hours

**Task:** a client calls with a notice to quit. Decide what happens next and tell the client.

| Task class                      | Complexity                                          | Interactive formats                                                         |
| ------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------- |
| 1. Clean notice, clear deadline | One notice type, nothing wrong with service         | Worked example of an intake; completion: fill in the deadline and next step |
| 2. Defective notice             | Wrong type, or a service problem                    | Document exercise: mark the defects on the notice                           |
| 3. Client in crisis             | Missing facts the client doesn't volunteer; urgency | Branching intake call; AI client with hidden facts (Level 3)                |

Part-task practice: deadline calculation drills; naming the four notice types. Procedural information: the service of process checklist, beside the task.

## Building this into the hub

What the hub needs so courses designed this way are easy to find and follow:

- **A skill shows its task-class ladder.** On a topic page, a course part can show its classes and where the learner is, instead of a flat list of parts.
- **Practice items know their place in 4C/ID.** Add to the scenario spec in `docs/simulations.md`: `task_class`, `support` (worked example, completion, conventional), `recurrent` vs `non_recurrent` aspects, links to supportive and procedural information, and the CIT incidents each scenario is based on.
- **Keep at hand = supportive and procedural information.** The topic page already puts reference first; label it by its role so authors file things in the right place.
- **Part-task drills are their own practice kind,** short and repeatable, separate from whole-task practice.
- **Fading needs progress.** Fading support (fewer hints each time) requires remembering what a learner has done. Today the hub keeps progress only in the browser; doing this properly needs the stored-progress decision in `docs/simulations.md`.

## How this shapes what we build next

1. **Run CIT interviews for one skill area** (Hearsay is the obvious pilot, since its course exists). This produces the task classes, rubric and scenario details everything else needs.
2. **Write Hearsay task classes 1 and 2 fully**, with all three support levels each. Mostly scripted, no AI: worked examples, completion tasks, a document exercise.
3. **Add part-task drills** as their own small practice items.
4. **Then AI role-play,** as the conventional task in class 3 (the oral hearing). This is where AI adds the most: open-ended practice with no single right script.

## Glossary

- **Whole task:** a realistic task done end to end, as in practice.
- **Task class:** a group of whole tasks of similar difficulty.
- **Worked example:** an expert's complete solution, studied.
- **Completion task:** a partly finished solution the learner completes.
- **Conventional task:** the whole task, done with no support.
- **Recurrent skill:** done the same way every time (steps, rules, formats).
- **Non-recurrent skill:** needs judgment; varies by situation.
- **Supportive information:** the understanding behind non-recurrent skills.
- **Procedural information:** just-in-time how-to for recurrent skills.
- **Part-task practice:** short repeated drills to make a recurrent skill automatic.
- **Critical incident:** a specific real moment where someone's behaviour clearly helped or hurt the outcome.

## Further reading to research

- van Merriënboer and Kirschner, _Ten Steps to Complex Learning_: the practical guide to 4C/ID.
- Flanagan (1954), "The Critical Incident Technique", _Psychological Bulletin_: the original method.
- Studies applying 4C/ID in professional education (medicine and nursing especially) and simulation-based legal education: useful models for task classes and rubrics.
