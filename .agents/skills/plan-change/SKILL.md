---
name: plan-change
description: >-
  Produce an implementation plan from exploration output after a grill-with-docs
  interview — goal, acceptance criteria, proposed change, files, flow, steps,
  tests, risks, alternatives, non-goals, decisions (GLOSSARY.md / decision log /
  ADRs), and engineer comprehension checklist. Use after explore-system and
  before implement-change or guided-implementation. Best with Claude Opus.
  Do not implement yet.
---

# Plan Change

Best model: **Claude Opus**

Input should include the `explore-system` output (or equivalent system map).

Do not implement in this skill. Obtain plan acceptance before `implement-change` (agent writes) or `guided-implementation` (human writes).

## Grill with docs (before planning)

Embed the grill-with-docs concept (grilling + domain-modeling) as text here. Do not depend on those skills being installed.

Map unsettled choices as a **design tree**. Work it in **rounds**. The **frontier** is every decision whose prerequisites are already settled.

### Grilling

Each round: ask the whole frontier at once — number each question and give your recommended answer. Use the structured question tool when available. Then wait for the human's answers before the next round.

A question whose answer depends on another still-open question belongs to a *later* round, not this one.

Finding facts is the agent's job (repo, docs, tools, subagents). Do not ask the human for anything you can look up. A running fact-finding subagent is an unsettled prerequisite: only questions downstream of it wait; ask the rest of the frontier now.

Decisions are the human's. Put each to them and wait.

Finish only when the frontier is empty and the human confirms shared understanding. Do not draft the plan while a material branch is still open.

### Domain modeling

- Challenge terms that conflict with existing `GLOSSARY.md` language.
- Propose precise canonical terms for vague or overloaded words.
- Stress-test domain relationships with concrete edge-case scenarios.
- When the human states how something works, check the code; surface contradictions.

### Recording (tiered)

| Level | Grill depth | What to write |
|-------|-------------|----------------|
| 0 | none | — |
| 1 | brief (usually 1–2 rounds) | Decisions in the plan's `DECISIONS` section. Clearly new project terms → `GLOSSARY.md` inline. |
| 2–3 | relentless until frontier empty | As items crystallize (not batched at the end): `GLOSSARY.md`, `docs/decisions/<YYYY-MM-DD>-<slug>.md`, and ADRs when they qualify. Level 3 expects at least one ADR. |

**Glossary:** Prefer root `GLOSSARY.md`, or the matching per-context file when `GLOSSARY-MAP.md` exists. Create lazily on the first resolved term. Vocabulary only — one or two sentence definitions, `_Avoid_` synonyms. No implementation detail, specs, or scratch notes.

**ADRs** (`docs/adr/NNNN-slug.md`, sequential numbering): offer only when all three are true — hard to reverse, surprising without context, and a real trade-off. Short paragraph is enough; Status / Considered Options / Consequences only when they add value.

**Decision log** (Level 2–3 extension): every round — question, options, recommendation, human answer, reason, rejected ideas / brainstorming. Plan links to this file. Fills the gap where non-ADR decisions would otherwise live only in chat.

Product-repo conventions win: reuse an existing glossary, context file, or ADR layout instead of creating a parallel one.

### Templates

Glossary entry:

```md
**Term**:
{One or two sentence definition of what it IS.}
_Avoid_: synonym1, synonym2
```

Minimal ADR (`docs/adr/NNNN-slug.md`):

```md
# {Short title of the decision}

{1–3 sentences: context, what we decided, and why.}
```

Decision-log round entry (`docs/decisions/<YYYY-MM-DD>-<slug>.md`):

```md
## Round N

### Q1 — {title}
- Options: …
- Recommended: …
- Decided: …
- Why: …
- Rejected / brainstormed: …
```

## Output format

```text
GOAL

ACCEPTANCE CRITERIA

CURRENT BEHAVIOR

PROPOSED CHANGE

FILES LIKELY TO CHANGE

DATA / CONTROL FLOW

IMPLEMENTATION STEPS

TEST STRATEGY

RISKS

ALTERNATIVES CONSIDERED

NON-GOALS

DECISIONS
(link to docs/decisions/… and any docs/adr/…; or inline for Level 1)

OPEN QUESTIONS
(must be empty before Level 2–3 plan acceptance)
```

## Engineer comprehension

Mandatory section. Identify what the human must hold in their head — not only what the agent needs.

```text
Before implementation, the engineer should understand:

1.
2.
3.
```

Prefer the smallest coherent plan. Call out when the change is Level 0–3 (see AGENTS.md / `ship-change`).
