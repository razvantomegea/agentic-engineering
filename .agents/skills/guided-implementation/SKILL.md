---
name: guided-implementation
description: >-
  Use when a plan exists and the human wants to write the code. Guides one
  coherent step at a time with minimal scaffold; human implements. Do not use
  when the agent should write the code.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: [engineering, teaching, implementation]
---

# Guided Implementation

## Purpose

Help the human write the **least necessary, most readable** code for the plan — agent guides, human types. Prefer minimal scaffold over dumped solutions. Align with [SIMPLICITY.md](../implement-change/SIMPLICITY.md). If using Claude (house): single-file step / single-file context → **Haiku 5.5** **`low`** / **`medium`**; otherwise **Sonnet 5.5** **`medium`**.

Use when an implementation plan already exists and the human wants to write the code with the agent as wingman.

```text
plan-change → guided-implementation → human writes ↔ agent guides → review-change / engineering-handoff
```

- **`implement-change`** — agent writes
- **`guided-implementation`** — plan exists; human types; agent guides
- **`tutor-me`** — never edit/run
- **`frontend-manual-practice`** — deliberate frontend practice, not shipping a planned feature

Do **not** implement the complete feature unless explicitly asked.

## Role

Guide through the plan. Human writes implementation. Agent may: explain what/why, point at files, teach, hint, show pseudocode or small illustrative snippets, review, diagnose, rethink the plan with the human.

## Workflow

One small coherent step at a time (batch related trivial steps when useful):

1. **Goal** — user/business value for this step
2. **Files** — which file(s) and where
3. **Context** — relevant existing code and conventions
4. **Requirements** — exactly what to implement
5. **Scaffold** — minimal starting structure when needed (not mandatory)
6. **Human implements**
7. **Review and continue** — review, answer, diagnose, update plan if understanding changed

Rules: do not dump many non-trivial steps at once; do not generate entire files/features by default; provide just enough scaffold; a coherent step may touch multiple files; do not blindly follow a stale plan — discuss better approaches; explanations proportional to difficulty.

## Hint ladder (when stuck)

Escalate only as needed:

1. **Question** — "What should own this state: parent or this component?"
2. **Concept** — name the idea without the implementation
3. **Direction** — plain-language next step
4. **Pseudocode / signature** — outline or types, not the solution
5. **Minimal fragment** — smallest unblock (rare)

## Guidance techniques

- **Smart scaffolding** — location, imports, signatures, empty bodies — not the solution.
- **Context-rich hints** — point at `existing-file.ts` patterns and stated invariants.
- **Error prevention** — warn about null, cache, atomicity, security before they trip.
- **Just-in-time teaching** — CONCEPT → WHY → HOW → HERE when a gap blocks progress.
- **Batch trivial steps** — "Steps 3–5 are similar; implement all three, then we review."
- **Environment awareness** — follow this repo's Result type, validation boundary, naming.
- **Pre-validation** — catch likely mistakes before the human writes.

## Understanding check

After meaningful steps, ask 1–2 targeted questions (what it does, when it fails, which invariant). For L0, keep lightweight. Human must be able to explain behavior, fit in the system, and failure modes.

## Completion (implementation phase)

Step done when: code written/compiles, human understands it, increment tests pass if applicable, plan updated if understanding changed. Full verification, `review-change`, and `engineering-handoff` follow by complexity level.

## Principle

We already have the plan. Guide me through building it efficiently while I remain the person writing and understanding the code. Prefer the smallest readable change at each step.

## Prerequisites

- Accepted plan (inline or on disk); human ready to type.

## Limitations

- Do not dump complete features/files unless explicitly asked.
- Do not run ahead of the human's understanding of important behavior.
- Not for agent-authored implementation (`implement-change`) or tutor-only mode (`tutor-me`).

## Troubleshooting

| Failure | Action |
|---------|--------|
| Human stuck | Hint ladder — question → concept → direction → pseudocode → minimal fragment |
| Plan feels wrong | Pause; discuss; update plan before more code |
| Agent wrote the solution without permission | Stop; revert to guidance; human rewrites. If the user explicitly asked for a complete solution, keep it. |

## Examples

- **Use:** "Walk me through implementing step S-03; I'll type."
- **Do not use:** "Just implement the whole plan" → `implement-change`.
