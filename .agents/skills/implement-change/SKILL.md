---
name: implement-change
description: >-
  Execute an approved direction as small coherent increments — implement,
  verify/observe, sync understanding when meaningful, then continue. Prefer
  existing patterns, no unrelated refactors, surface material deviations and
  non-obvious decisions when they occur. Use after plan acceptance for Level
  1+ work, or directly for trivial Level 0 changes. Best in Cursor. Keep
  lightweight; opportunistic learning when understanding is at stake.
---

# Implement Change

Best tool: **Cursor**

Execute an approved **direction** (plan or clear Level 0 intent) as a continuous
implementation loop — not a single opaque dump followed by a late handoff.

## Loop

```text
APPROVED DIRECTION
→ SMALL COHERENT INCREMENT
→ VERIFY / OBSERVE
→ SYNC UNDERSTANDING WHEN MEANINGFUL
→ NEXT INCREMENT
```

## Rules

- Follow the approved direction / plan.
- Implement **one meaningful coherent step** at a time (conceptual unit — not every file edit).
- Do **not** require permission before every edit.
- Do **not** narrate routine mechanical details.
- Do **not** create excessive checkpoints; a checkpoint = a meaningful conceptual change.
- Prefer existing patterns.
- Do not refactor unrelated code.
- Verify important behavior as soon as practical (types, tests, lint, build, runtime observation).
- When evidence changes understanding, **stop and update the shared mental model** before continuing.
- When an implementation choice is non-obvious, surface it briefly **when it occurs** — do not wait until final handoff for important architectural, behavioral, or logical decisions.
- Before a **material** deviation from the plan: explain why immediately, then proceed once the direction is clear (or the deviation is clearly reversible and stated).
- Optimize for correct implementation, fast feedback, and sustained shared understanding.

## Opportunistic learning

Teach or sync briefly when a concept, decision, unexpected behavior, or knowledge gap **materially** affects understanding of the change.

Do **not** interrupt for trivial edits or turn every step into a tutorial.

`engineering-handoff` remains the final ownership / comprehension check for meaningful work — not the only moment understanding is allowed to update.

## Completion

State what was implemented relative to the direction, what was verified, any material deviations, and any decisions that updated the shared model. Hand off to verification / `review-change` / `engineering-handoff` as complexity requires.
