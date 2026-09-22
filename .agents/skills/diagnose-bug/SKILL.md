---
name: diagnose-bug
description: >-
  Strict observation-hypothesis-evidence debugging loop. Use when something is
  broken, flaky, wrong, throwing, or slow — and when speculative edit-refresh
  cycles would be the wrong default. Best in Cursor. Do not modify production
  code until evidence supports a plausible root cause (unless the change is an
  intentional diagnostic experiment).
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

## Completion

State root cause, fix, regression coverage, and what remains unverified.
