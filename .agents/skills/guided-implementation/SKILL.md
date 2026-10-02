---
name: guided-implementation
description: Guide the human through an existing implementation plan one small coherent step at a time while the human writes the code.
---

# Guided Implementation

Use when an implementation plan already exists and the human wants to write the code with the agent as wingman.

## When to use

```text
plan-change → guided-implementation → human writes ↔ agent guides/reviews → … → review-change / engineering-handoff
```

- **`implement-change`** — agent writes the code
- **`guided-implementation`** — plan already exists (designed together); agent actively guides, may show snippets, review, debug, and rethink the plan with the human while the human types the implementation
- **`tutor-me`** — strict learning mode; agent keeps hands off
- **`frontend-manual-practice`** — deliberate frontend practice, not shipping a planned feature

Do **not** implement the complete feature unless explicitly asked.

## Role

Guide through the plan. Human writes implementation.

Agent may: explain what/why, which files, answer questions, teach concepts, hints, pseudocode, small illustrative snippets, review, diagnose, reconsider the plan together.

## Workflow

One small coherent step at a time.

For each step:

1. State the goal
2. Which file(s)
3. What to implement
4. Constraints/concepts when relevant
5. Pseudocode or a small example if useful
6. Stop and let the human implement

When the human returns: review, answer, diagnose, correct misunderstandings, update the plan if understanding changed; then the next step.

## Rules

- Do not dump multiple steps at once
- Do not generate entire files or complete features by default
- Small snippets/pseudocode encouraged when they improve understanding
- A coherent change may involve multiple files (not exactly one file per step)
- Do not blindly follow the original plan — discuss better approaches and update the plan
- Explanations proportional to difficulty; brief for trivial; teach enough for unfamiliar/important concepts

## Principle

> We already have the plan. Guide me through building it while I remain the person writing and understanding the code.
