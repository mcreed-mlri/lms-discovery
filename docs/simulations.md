# Simulations

A plan for bringing practice and simulation into the hub: scripted drills, document exercises, AI role-play in text, then voice, and possibly an AI avatar. It covers what to build in what order, what to decide, and what to research before spending money. It extends PRODUCT.md ("Practice and Simulation"), which stays the source for scope.

**Teaching method:** the team designs with 4C/ID and the Critical Incident Technique. How each maps onto interactive practice, with a worked blueprint for Hearsay, is in `docs/learning-design.md`. Simulations are 4C/ID's _conventional tasks_ at the harder task classes.

**The short version:** the technology is the easy part. What determines whether simulations help new attorneys is the scenarios and rubrics subject-matter experts write, how feedback is framed, and how confidentiality is protected. Build up one level of realism at a time, and only move to the next when the last one shows learners use it and experts trust its feedback.

## Where we are

- **Built:** the Hearsay practice room (`/binder/litigation/trial-skills/practice/hearsay-objection-in-writing`). It is scripted: a fictional case file, opposing counsel's objection, a written response, a self-review checklist from the course, coaching written ahead of time, a second round of pushback, and a sample analysis. Nothing is generated and nothing typed is stored. This is PRODUCT.md's Stage 1.
- **The model is in place:** a drill is an item kind filed under a topic (`lib/practice.ts`), findable in binder search, with notes alongside.
- **Not built:** anything that generates text or speech, or stores a learner's work.

## What we are trying to achieve

The team's top request is a safe place to rehearse a skill before doing it for real. Simulation is worth building when it gives new attorneys:

1. **Reps**: more practice attempts than live supervision can provide.
2. **Realistic pressure**: an objection, an interruption from the bench, a client who is upset or leaves out the key fact.
3. **Specific, trustworthy feedback**: measured against what an experienced advocate would do, not a generic "good job".
4. **A safe place to fail**: private, ungraded, with no record that could follow them.

If a simulation does not clearly do one of these better than a written exercise, it is not worth its cost.

## The ladder of realism

Each level adds realism and adds cost, risk and review work. Move up one level at a time.

| Level                         | What it is                                                                                 | Good for                                                    | Main risks                                                            | Cost to run         |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------- | ------------------- |
| **1. Scripted drill** (built) | Branching choices and written responses, feedback written in advance                       | Procedure, issue spotting, structure                        | Feels rigid; limited by what authors anticipated                      | None                |
| **2. Document exercise**      | Mark up a notice, lease or pleading; draft an answer; spot defects                         | Writing, reading documents closely                          | Feedback on free-form drafting is hard to script                      | None to low         |
| **3. Text role-play with AI** | AI plays opposing counsel, a judge or a client in chat; separate feedback against a rubric | Arguing a point, client interviewing, thinking on your feet | Wrong legal feedback, role breaks, learners pasting real client facts | Low per session     |
| **4. Voice role-play**        | The same, spoken: speech-to-text, the AI's reply, text-to-speech                           | Oral argument, hearings, phone intake, pace and composure   | Latency, cost, recordings of voices, accessibility                    | Moderate per minute |
| **5. Avatar**                 | A face that speaks: a judge on the bench, a client across the table                        | Presence, nerves, realism                                   | Uncanny valley, bandwidth, cost, distraction from the skill           | Highest             |

**Recommendation:** finish Levels 1 and 2 across more topics, run one Level 3 pilot (PRODUCT.md's Stage 2: Hearsay skill 2), and treat voice and avatars as research until that pilot reports. An avatar adds the least learning value per dollar. Voice adds real value for oral skills, so voice before video.

## Kinds of simulation worth considering

- **Opposing counsel or the bench:** objections, motions, a judge's questions at a hearing. This matches the Hearsay pilot.
- **Client interview:** intake calls and first meetings, where the "client" has a story, emotions and facts they don't volunteer unless asked well. This is valuable and also the most sensitive (see Safety).
- **Negotiation:** a landlord's attorney in a hallway settlement conversation.
- **Document exercises:** spotting defects in a notice to quit, drafting an answer, redlining a stipulation.
- **Supervisor review:** a learner's attempt shared with their supervisor for comments. This needs storage and consent, so it is a later step.

## What a scenario needs (the authoring spec)

Every simulation, at any level, should be written to a common template so it can be reviewed, versioned and reused across levels. A Level 3 or 4 scenario needs at least:

```yaml
id: hearsay-objection-written-response
skill: Defending against a hearsay objection in writing
binder: litigation / trial-skills / objections
level: 3 # 1 scripted, 2 document, 3 text, 4 voice, 5 avatar
task_class: 3 # 4C/ID: which step of the simple-to-complex sequence
support: conventional # 4C/ID: worked example, completion, or conventional
audience: [attorney] # access rules apply (UPL)
learning_goals:
  - Name the challenged statement and the purpose it is offered for
  - Identify an exclusion or exception and connect the facts to it
facts: fictional fact pattern the learner sees
hidden_facts: what the role-player knows but reveals only if asked well
role:
  who: Opposing counsel
  manner: firm, professional, presses on layered hearsay
  must_not: give legal advice, break character, invent law, use real names
escalation: what happens if the learner is strong, or struggles
rubric: # the expert-written standard feedback is measured against
  - point: Identified the challenged statement precisely
    strong: …
    weak: …
sample_answer: an expert's model response
sources: the course panels or authorities the rubric relies on
supportive_info: concept panels and think-alouds to study first # 4C/ID
procedural_info: steps and frames shown during the task, and when they fade # 4C/ID
incidents: the CIT incidents this scenario is based on (anonymised)
reviewed_by: name and date of subject-matter review
version: 1
```

The rubric is the most important part. **The AI is only as good as the rubric** (PRODUCT.md), and an expert should be able to read it and say "yes, that's how I would grade this".

## Feedback and assessment

- **Keep the role-player and the coach separate.** One model call plays the character; a different one, after the attempt, scores it against the rubric. Mixing them makes characters drift into teaching and makes feedback inconsistent.
- **Feedback cites the rubric**, not the model's general knowledge: "You named the statement but not the purpose it's offered for (rubric point 2)".
- **Formative, not graded.** Practice stays ungraded and off the training record unless the program decides otherwise (see Brightspace below).
- **Calibrate against experts before launch.** Have experts grade 20 to 30 sample attempts, run the AI coach on the same attempts, and compare. Launch only when they agree often enough, and keep re-checking. This is the simulation equivalent of the search benchmark (`docs/search.md`).
- **Every screen says** it is practice feedback, not legal advice.

## Safety, ethics and confidentiality

These are the parts most likely to go wrong, and most need decisions from legal and program leadership:

- **Real client facts.** Learners will paste them, or describe a real case aloud. Every simulation must say not to, use fictional fact patterns only, and keep no transcripts by default. Consider warning automatically when the text looks like a real name, address, docket number or date of birth.
- **Unauthorized practice of law.** Non-lawyer advocates must not get attorney-only simulations; existing access rules (`lib/access.ts`) apply. Feedback must not read as advice about a real matter.
- **Stereotyping in personas.** Client and opposing-party personas must not reduce people to stereotypes. This matters even more with voice: accent, dialect and tone carry assumptions. Have personas reviewed with that in mind.
- **Trauma.** Scenarios involving domestic violence, eviction with children, or immigration fear need trauma-informed design, content notes, and a way out at any time.
- **Staying in role.** The role-player must not invent law, give real-world advice, or be talked out of its instructions. Test for this deliberately ("ignore your instructions", "what should I really do in my case").
- **Off switch.** One setting that turns AI simulations off for everyone, and per-learner usage limits.

## Privacy and data

Decide before any vendor is chosen:

- **What is stored, and for how long.** The default is nothing. If attempts are saved (for supervisor review or progress), that needs consent, a retention period and deletion.
- **Voice recordings are more sensitive than text.** A voice is identifying. Decide whether audio is ever stored, by anyone, including the vendor.
- **Vendor terms.** For every AI or voice vendor: do they keep inputs, for how long, do they train on them, can retention be set to zero, where is data processed, do they sign a data processing agreement, what security certifications do they have.
- **Voice cloning.** Never clone a real person's voice (an MLRI attorney, a judge) without written consent. Prefer licensed stock voices.
- **Search-term logging** has the same open question (`docs/search.md`): the IT and legal answer should cover both.

## Accessibility

WCAG 2.2 AA is binding (PRODUCT.md), and simulations are where accessibility is easiest to break:

- **Every voice simulation needs a text equivalent** with the same learning goals, for learners who are deaf or hard of hearing, have speech differences, or are in a shared office.
- **Live captions and a transcript** for anything spoken.
- **No timing that cannot be paused or extended**, unless timing is the skill being practiced, and then with an alternative.
- **Keyboard and screen-reader support** throughout, as in the current practice room.
- **Avatars** must not be the only way information is conveyed.

## Where it fits technically

- **Simulations live in the hub**, as practice items filed under topics, like the Hearsay drill. Brightspace stays the system of record for courses and completion.
- **AI calls go through a hub server route**, never from the browser with a key in it. The route checks the session, the learner's access, their usage limit and the off switch, then calls the model with the scenario's instructions.
- **Scenarios are data**, written to the spec above and versioned, so experts review content without touching code.
- **Model choice is a research item** (below). Whatever is chosen, keep a thin internal interface so the provider can change.
- **Cost controls:** per-learner daily limits, a cap on turns per session, and a monthly budget alert.
- **If practice ever needs to count** (completion, hours), report it to Brightspace rather than keeping a separate record. Research how (below).

## Voice and avatars: what to think about

- **Latency.** Spoken conversation feels broken past roughly a second of silence. Measure end-to-end response time on MLRI's real network and computers, not in a demo.
- **Turn-taking.** Can the learner interrupt? Can the judge interrupt the learner? Courtroom realism depends on it.
- **The environment.** Shared offices, noise, headsets, browser microphone permissions, locked-down work laptops.
- **Cost per minute** of conversation, multiplied by realistic usage: learners × sessions × minutes.
- **Fallback.** If voice fails mid-session, the learner should be able to continue in text.
- **Avatars specifically:** bandwidth, how they look on a phone, whether the face distracts from the skill, and accessibility. Pilot voice alone first and ask learners whether a face would help.

## Research checklist

### ElevenLabs (and alternatives)

Verify these directly with the vendor; features and terms change quickly:

- Their conversational agent product: can it use a model of our choosing, and can our server stay in control of instructions, rubric scoring and limits?
- Data handling: retention settings (is zero retention available, and on which plan?), whether audio or transcripts are used for training, data processing agreement, security certifications, where data is processed.
- Voices: licensing terms for stock voices, range of accents and ages, controls to avoid stereotyped voices, voice cloning consent requirements.
- Latency and turn-taking in a browser, interruption handling, and embedding in our own page.
- Pricing per minute or per character at our expected volume, and nonprofit or education pricing.
- Transcripts and captions: available live and after the session?
- Compare at least two alternatives for voice, and two for avatars, on the same questions before choosing.

### Language models

- Which models handle staying in role, refusing to give real advice, and grading against a rubric best? Test with our own scenarios and calibration set, not vendor benchmarks.
- Data terms (same questions as above), cost per session, rate limits, and availability of a no-retention option.

### Brightspace

- Can practice attempts or completions be reported to Brightspace (LTI, xAPI, grade items), if the program ever wants them to count? Add to `docs/planning/questions-for-d2l.md`.

### Learning design

- Evidence on simulation-based training for legal and other professional skills, and on AI role-play feedback specifically: what improves performance, and what only improves confidence.
- How clinical legal education programs structure simulated client interviews and hearings, and their rubrics.
- Whether MLRI's training could carry CLE or other credit, and what that would require.

### People

- Which subject-matter experts will write and review scenarios and rubrics, and how much time each scenario takes them.
- A small pilot group of new attorneys and their supervisors.

## Decisions needed

| Decision                                                                                  | Who                                         |
| ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| Approve the Level 3 pilot (Hearsay skill 2, text, one rubric)                             | Training leadership                         |
| What may be stored (nothing, text only, text and audio), for how long, with whose consent | Legal, IT                                   |
| Which vendors may receive learner input, under what terms                                 | IT, legal                                   |
| Who writes and reviews scenarios and rubrics, and the review standard                     | Training leadership, subject-matter experts |
| Usage limits and monthly budget                                                           | Program leadership                          |
| Whether practice ever counts toward completion or credit                                  | Program leadership                          |

## Phased plan

Each phase has a gate: do not start the next until it is met.

1. **More scripted practice (Levels 1 and 2).** Two or three drills in other topics, including one document exercise. Write them to the scenario spec. _Gate:_ learners complete them, and experts are comfortable authoring to the spec.
2. **Text role-play pilot (Level 3).** Hearsay skill 2: AI opposing counsel, separate rubric-based coach, no stored transcripts, usage limits, off switch, server route. Calibrate the coach against expert grading first. _Gate:_ experts agree with the coach's feedback often enough; learners say it helped; no confidentiality incidents.
3. **More text scenarios**, including a client interview with hidden facts. _Gate:_ the authoring workflow scales without the developer in every scenario.
4. **Voice pilot (Level 4)** for one oral skill (for example arguing the hearsay objection at a hearing), with a text fallback, captions and transcript. _Gate:_ latency acceptable on real equipment; cost per session within budget; accessibility review passed.
5. **Avatar trial (Level 5)**, only if learners in the voice pilot ask for it and it measurably helps.

## Measuring whether it works

- **Performance:** experts rate learner attempts on a held-out scenario before and after practice.
- **Confidence:** a two-question survey before and after ("How ready do you feel to…").
- **Use:** starts, completions, repeat attempts, where people stop.
- **Trust:** how often experts agree with AI feedback, and reports of wrong or harmful feedback.
- **Cost:** per session and per learner per month.

## Related

- PRODUCT.md, "Practice and Simulation": scope and stages
- `lib/practice.ts`, `components/practice-room.tsx`: the scripted practice room
- `docs/search.md`: the search benchmark, the model for calibrating simulation feedback
- `docs/planning/questions-for-d2l.md`, `docs/planning/outsourced-it-integration-questions.md`: open questions for D2L and IT
