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

## Stop gate

After two consecutive experiments that make no useful progress toward identifying the root cause, or when the next step would be a speculative production edit, stop and report the open hypotheses, the evidence gathered, and the next experiment needed — do not keep patching.

## Completion

State root cause, fix, regression coverage, and what remains unverified.
