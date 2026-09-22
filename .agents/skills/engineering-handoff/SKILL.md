---
name: engineering-handoff
description: >-
  Transfer the mental model of a completed change to the responsible engineer:
  problem, before/after, responsibilities, flow, decisions, invariants, failure
  modes, verification, then quiz with retrieval practice (do not answer for the
  user). Use after implementation and independent review for meaningful work.
  Anti-vibe-coding ownership gate.
---

# Engineering Handoff

Your task is to make the responsible engineer capable of owning and explaining the completed change.

Do not teach syntax.

Do not provide a line-by-line walkthrough.

Focus on mental models, architecture, behavior, decisions, and debugging knowledge.

## 1. Problem

Explain in 2–4 sentences what problem was solved.

## 2. Before

Explain how the relevant system worked before the change.

Use a compact flow where helpful:

A → B → C → D

## 3. After

Explain how the system works now.

Identify exactly what changed in the flow.

## 4. Responsibilities

Identify the important components/modules/functions involved and what each owns.

Focus on boundaries rather than implementation trivia.

## 5. Data and control flow

Trace one normal request/user action through the system from beginning to end.

Include state changes, external calls, async boundaries, caches, persistence, or side effects where relevant.

## 6. Design decisions

For each meaningful decision explain:

- what was chosen
- why
- what obvious alternative existed
- why that alternative was not selected

Do not invent decisions that were never actually made.

## 7. Invariants

List the important things that must remain true for the system to work correctly.

Examples:

- only X owns this state
- Y must happen before Z
- this value cannot be null after this boundary
- this operation must remain idempotent

Only include relevant invariants.

## 8. Failure modes

Explain the most realistic ways this feature could fail.

For each, explain where you would investigate first.

## 9. Verification

Explain:

- what tests/checks exist
- what each important test protects
- what was manually verified
- what was not verified

Never imply verification that did not occur.

## 10. Reviewer questions

Give me 3–7 questions a good senior engineer might ask about this PR.

Do NOT immediately answer them.

Wait for me to answer.

After I answer:

- identify misunderstandings
- correct them
- ask follow-up questions only where necessary

## Ownership Gate

I should be able to answer, without relying on the implementation agent:

1. What problem does this solve?
2. Where does this behavior live?
3. What is the important data/control flow?
4. What changed?
5. Why was this implementation chosen?
6. What assumptions/invariants matter?
7. What could break?
8. How would I debug it?
9. How do we know it works?

The purpose is not memorization.

The purpose is engineering ownership.

This is the anti-vibe-coding mechanism.

Do not skip it on meaningful company work.

## Quiz discipline (retrieval practice)

After the explanation, quiz — do not let passive reading substitute for ownership.

Example prompts (adapt to the change):

- Where does state ownership live?
- Why wasn't X implemented in the component?
- What happens if the API request fails halfway through?
- Which test protects this invariant?

Wait for answers. Correct misunderstandings. Follow up only where necessary.
