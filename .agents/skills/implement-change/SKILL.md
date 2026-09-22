---
name: implement-change
description: >-
  Execute an approved plan with minimal ceremony — follow the plan, prefer
  existing patterns, no unrelated refactors, verify as you go, record only
  non-obvious choices. Use after plan acceptance for Level 1+ work, or
  directly for trivial Level 0 changes. Best in Cursor. Learning happens at
  explicit gates, not during every edit.
---

# Implement Change

Best tool: **Cursor**

Cursor gets the approved plan and executes it.

## Rules

- Follow the approved plan.
- Before deviating materially from the plan: explain why.
- Prefer existing patterns.
- Do not refactor unrelated code.
- Implement one coherent step at a time.
- Run relevant checks throughout implementation.
- When an implementation choice is non-obvious, briefly record why it was chosen.
- Do not produce long educational explanations while coding unless asked.
- Optimize for correct implementation and fast feedback.

Learning happens at explicit gates (`engineering-handoff`), not during every edit.

## Completion

State what was implemented relative to the plan, what was verified, and any material deviations. Hand off to verification / `review-change` / `engineering-handoff` as complexity requires.
