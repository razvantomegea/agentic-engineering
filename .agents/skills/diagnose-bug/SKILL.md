---
name: diagnose-bug
description: >-
  Use when something is broken, flaky, wrong, throwing, or slow. Runs a strict
  observation-hypothesis-evidence loop instead of speculative edit-refresh
  cycles.
---

# Diagnose Bug

Best tool: **Cursor**

Prohibit: change something → refresh → change something else → pray.

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
- A too-particular fix is a hardcoded patch ([SIMPLICITY.md](../implement-change/SIMPLICITY.md) rule 10).

## Stop gate

After two consecutive experiments that make no useful progress toward identifying the root cause, or when the next step would be a speculative production edit, stop and report the open hypotheses, the evidence gathered, and the next experiment needed — do not keep patching.

## Completion

State root cause, fix and why it covers the whole class, regression coverage, and what remains unverified.
