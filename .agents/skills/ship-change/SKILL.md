---
name: ship-change
description: >-
  Orchestrate the ownership-preserving ship workflow by complexity level.
  Meaningful work: explore → detailed plan → review plan → accept → implement →
  diagnose if needed → verify → independent review → resolve findings →
  engineering-handoff → ownership gate. Trivial work: implement → verify.
  Use when starting a ticket or feature meant to reach merge. Does not
  duplicate the child skills.
---

# Ship Change

Orchestration only. Do not duplicate the content of the phase skills — invoke them conceptually (or load them) as needed.

Enforce phase boundaries: `plan-change` and both `review-change` modes are documentation-only. They may inspect files/diffs and existing evidence, ask questions, and write documentation; they must not execute code or shell commands, including tests/builds/scripts, or delegate execution. Pass executable investigations and checks to a separate implementation/verification phase, and fixes to implementation. Do not run checks on their behalf while still labeling the active phase planning or review. Resume the documentation phase with attributed evidence; keep required unresolved facts BLOCKED. Code snippets and commands in plans/reviews remain inert text.

If the situation type is unclear, start with `engineering-copilot` first, then return here once the level/workflow is chosen.

## Complexity

| Level | Examples | Path |
|-------|----------|------|
| 0 trivial | copy, CSS tweak, rename, obvious one-liner | implement → verify |
| 1 normal | small feature, isolated bug, component behavior, API integration | focused explore → plan-change → readiness check → accept → implement → review if appropriate → short handoff |
| 2 significant | new feature, new state architecture, auth, payments, data model, complex async, large refactor, shared infra | full workflow (relentless grill + docs) |
| 3 architectural | new service, new boundary, framework migration, major state management, platform | full workflow + ADR (relentless grill + docs) |

### Solo products

Default: SPEC → AGENT BUILDS → TEST → AI REVIEW → SHIP.

Full handoff only for auth, payments, security, infrastructure, database architecture, data-loss risks, expensive APIs, business-critical logic.

SPEC uses `plan-change` for nontrivial work. A shorter handoff does not waive decision completeness. An explicit request for exhaustive planning overrides the brief/trivial defaults. Scale detail to relevant behavior, never by leaving the implementer to guess.

## Meaningful work (Level 2–3)

1. run `explore-system`
2. run `plan-change`, loading its question bank and plan template; ask detailed questions in dependency-aware rounds until every material choice is resolved. Save the implementation story, code samples, file/symbol map, ordered steps, and acceptance matrix; maintain the decision log, glossary when needed, and applicable ADRs as decisions crystallize
3. run `review-change` in **plan mode**, preferably independently with fresh context. Supply the saved plan and repository baseline, not just a chat summary. Resolve BLOCKING/IMPORTANT findings; return unanswered choices to planning and recheck affected sections
4. obtain plan acceptance only once the readiness gate passes, `OPEN QUESTIONS` is empty, and the plan and required records exist on disk. Record acceptance of the plan revision; existing acceptance for the same direction counts
5. use `implement-change` with the accepted plan path/revision, linked decisions, step order, and verification commands. If evidence invalidates material decisions, update/review affected plan sections and resolve them before dependent implementation
6. use `diagnose-bug` if necessary
7. run repository verification
8. request independent review (`review-change` in **implementation mode**, preferably Codex with fresh context); supply the accepted plan, actual diff, verification evidence, decision log, and ADRs
9. resolve blocking/important findings
10. run `engineering-handoff`; cite the decision log and ADRs as the source of the "why"
11. pass ownership gate

## Trivial work (Level 0)

```text
implement → verify
```

Do not turn a button-margin change into a NATO operation.

## Tool defaults

```text
TICKET
  → Claude Opus: EXPLORE
  → Claude Opus: GRILL human, record GLOSSARY.md / docs/decisions / docs/adr
  → Claude Opus: DETAILED IMPLEMENTATION PLAN
  → Codex: PLAN REVIEW (resolve gaps before building)
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
