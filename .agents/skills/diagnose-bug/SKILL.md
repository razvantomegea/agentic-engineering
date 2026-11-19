---
name: diagnose-bug
description: >-
  Use when behavior is broken, flaky, wrong, throwing, or slow. Runs a strict
  observation-hypothesis-evidence loop instead of speculative edit-refresh
  cycles. Do not use for greenfield features.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: engineering, debugging, diagnosis
---

# Diagnose Bug

## Purpose

Find root cause with evidence before writing a fix — then fix the **class** with the least amount of readable code that covers it ([SIMPLICITY.md](../implement-change/SIMPLICITY.md) rule 10). Best tool: **Cursor**. If using Claude (house): single-file / single-file context → **Haiku 5.5** **`low`** / **`medium`**; otherwise **Sonnet 5.5** **`medium`**. Raise effort before switching models; escalate Sonnet → Opus if stuck.

Prohibit: edit → refresh → edit again → pray.

## Loop

```text
OBSERVATION

EXPECTED BEHAVIOR

ACTUAL BEHAVIOR

HYPOTHESES
1.
2.
3.

EVIDENCE NEEDED

EXPERIMENT

RESULT

UPDATED HYPOTHESES

ROOT CAUSE

FIX

REGRESSION TEST
```

## Critical rule

Do not modify production code until there is enough evidence supporting a plausible root cause, unless the modification itself is an intentional diagnostic experiment.

## Fix the class, not the case

- The fix must handle every input that shares the root cause. A guard tests the property that is wrong (`amount < 0`, `index >= length`), never only the value that failed (`amount === -1`) unless that value is the whole class.
- Forbidden: a special-case branch for one input when the root cause is shared logic; suppressing the error for that case; a null check at the one crashing call site while other call sites that receive null still mishandle it. A local check is fine when those other call sites already handle null correctly.
- Regression test: when the root cause is shared logic, include at least one input from the same class that was not the original trigger. When the class genuinely has one case (wrong config key, single race window), say why in one line.
- If covering the class needs changes outside the requested scope, report it instead of widening silently.
- A too-particular fix is a hardcoded patch ([SIMPLICITY.md](../implement-change/SIMPLICITY.md) rule 10). Prefer the smallest correct fix; do not add speculative infrastructure.

## Stop gate

After two consecutive experiments that make no useful progress toward identifying the root cause, or when the next step would be a speculative production edit, stop and report the open hypotheses, the evidence gathered, and the next experiment needed — do not keep patching.

## Completion

State root cause, fix and why it covers the whole class, regression coverage, and what remains unverified.

## Prerequisites

- Reproducible symptom or failing check when available; an observed symptom or report is enough to begin. Prefer reproduction as an investigation step (Loop: EVIDENCE NEEDED / EXPERIMENT). When a production report cannot be reproduced, proceed with logs-only diagnosis using available logs, code, and tests.

## Limitations

- Not for feature design (`plan-change`) or unexplained refactors.
- Do not ship a one-off guard that leaves sibling inputs failing.

## Troubleshooting

| Failure | Action |
|---------|--------|
| No progress after two experiments | Stop gate — report hypotheses and next evidence |
| Fix only matches the trigger value | Reject; generalize to the class (rule 10) |
| Flaky / timing | Capture ordering evidence before editing |

## Examples

- **Use:** "Checkout throws when the cart is empty — diagnose before fixing."
- **Do not use:** "Add a new payments provider" → `plan-change` / `ship-change`.
