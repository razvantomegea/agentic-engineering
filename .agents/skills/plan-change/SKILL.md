---
name: plan-change
description: >-
  Produce an implementation plan from exploration output — goal, acceptance
  criteria, proposed change, files, flow, steps, tests, risks, alternatives,
  non-goals, and engineer comprehension checklist. Use after explore-system
  and before implement-change. Best with Claude Opus. Do not implement yet.
---

# Plan Change

Best model: **Claude Opus**

Input should include the `explore-system` output (or equivalent system map).

Do not implement in this skill. Obtain plan acceptance before `implement-change`.

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
