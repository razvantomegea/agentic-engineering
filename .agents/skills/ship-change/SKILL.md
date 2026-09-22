---
name: ship-change
description: >-
  Orchestrate the ownership-preserving ship workflow by complexity level.
  Meaningful work: explore → plan → accept → implement → diagnose if needed →
  verify → independent review → resolve findings → engineering-handoff →
  ownership gate. Trivial work: implement → verify. Use when starting a ticket
  or feature meant to reach merge. Does not duplicate the child skills.
---

# Ship Change

Orchestration only. Do not duplicate the content of the phase skills — invoke them conceptually (or load them) as needed.

If the situation type is unclear, start with `engineering-copilot` first, then return here once the level/workflow is chosen.

## Complexity

| Level | Examples | Path |
|-------|----------|------|
| 0 trivial | copy, CSS tweak, rename, obvious one-liner | implement → verify |
| 1 normal | small feature, isolated bug, component behavior, API integration | brief explore → implement → Codex review if appropriate → short handoff |
| 2 significant | new feature, new state architecture, auth, payments, data model, complex async, large refactor, shared infra | full workflow |
| 3 architectural | new service, new boundary, framework migration, major state management, platform | full workflow + ADR |

### Solo products

Default: SPEC → AGENT BUILDS → TEST → AI REVIEW → SHIP.

Full handoff only for auth, payments, security, infrastructure, database architecture, data-loss risks, expensive APIs, business-critical logic.

## Meaningful work (Level 2–3)

1. run `explore-system`
2. run `plan-change`
3. obtain plan acceptance
4. use `implement-change`
5. use `diagnose-bug` if necessary
6. run repository verification
7. request independent review (`review-change`, preferably Codex with fresh context)
8. resolve blocking/important findings
9. run `engineering-handoff`
10. pass ownership gate

## Trivial work (Level 0)

```text
implement → verify
```

Do not turn a button-margin change into a NATO operation.

## Tool defaults

```text
TICKET
  → Claude Opus: EXPLORE
  → Claude Opus: PLAN
  → YOU: accept plan
  → Cursor: IMPLEMENT
  → (problem?) Cursor: DEBUG via diagnose-bug
  → VERIFY
  → Codex: FRESH REVIEW
  → fix BLOCKING / IMPORTANT
  → ENGINEERING HANDOFF
  → AI QUIZZES YOU
  → understand? MERGE : LEARN
```

Roles: Claude = Thinker, Cursor = Builder, Codex = Skeptic, Claude/Cursor = Teacher after review.
