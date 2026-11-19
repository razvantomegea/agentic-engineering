---
name: ship-change
description: >-
  Use when starting a ticket or feature meant to reach merge. Orchestrates
  explore through handoff by complexity without duplicating child skills. Do
  not use for a single isolated phase.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: engineering, orchestration, workflow
---

# Ship Change

## Purpose

Route work to merge with ceremony matching risk — and without ceremony that produces extra code. Child skills own phase detail; this skill only sequences them. Prefer least-code outcomes via `plan-change` / `implement-change` / [SIMPLICITY.md](../implement-change/SIMPLICITY.md).

Orchestration only. Do not duplicate the content of the phase skills — invoke them conceptually (or load them) as needed.

Phase boundaries: `plan-change` and both `review-change` modes are documentation-only (see `AGENTS.md` Phase boundary). Pass execution and fixes to implementation/verification.

If the situation type is unclear, start with `engineering-copilot`, then return here.

## Complexity

Use the Level 0–3 table in `AGENTS.md`. Paths:

- **L0:** implement → verify. No ceremony.
- **L1:** brief explore → **inline plan** (5–10 lines in chat) → implement → verify → review if useful → short handoff. Saved `plan-change` only if requested or it grows to L2.
- **L2–L3:** full workflow below (+ ADR at L3).

### Solo products

Default: SPEC → AGENT BUILDS → TEST → AI REVIEW → SHIP. Full handoff only for auth, payments, security, infrastructure, database architecture, data-loss risks, expensive APIs, business-critical logic.

SPEC uses `plan-change` for nontrivial work. An explicit request for exhaustive planning overrides brief/trivial defaults.

## Meaningful work (Level 2–3)

1. run `explore-system`
2. run `plan-change`, loading its question bank and plan template; ask detailed questions in dependency-aware rounds until every material choice is resolved. Save the two-part plan (Part A why: scope, before/after, decisions, contracts; Part B do: preflight, anchored steps, verification, stop conditions); maintain the decision log, glossary when needed, and applicable ADRs as decisions crystallize
3. run `review-change` in **plan mode**, preferably independently with fresh context. Supply the saved plan and repository baseline, not just a chat summary. Resolve BLOCKING/IMPORTANT findings; return unanswered choices to planning and recheck affected sections
4. obtain plan acceptance only once the readiness gate passes, `OPEN QUESTIONS` is empty, and the plan and required records exist on disk. Record acceptance of the plan revision; existing acceptance for the same direction counts
5. use `implement-change` with the accepted plan path/revision; it runs Part B's preflight, then the steps in order. If a stop condition fires or evidence invalidates material decisions, update/review affected plan sections and resolve them before dependent implementation
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

If using Claude — **house ladder** (overrides blog defaults below): explore/plan/review → **Opus 5.5** **`high`** / **`xhigh`**; multi-file implement/debug → **Sonnet 5.5** **`medium`**; single-file / single-file context → **Haiku 5.5** **`low`** / **`medium`**. Raise effort before switching models; **Fable 5.2** when Opus at `high` still falls short (hardest/L3). Always name effort with the model.

**Blog baseline** ([which Claude model](https://claude.dev/blog/which-claude-model-should-you-build-with/)): start most work on Opus 5.5 at `medium`; well-scoped coding (bug fix / spec-driven) → Sonnet 5.5 `medium` then `high`; Haiku 5.5 → short prompts, classification/routing/extraction, and subagents that search files / read logs / summarize (keep judgment-heavy edits on a larger model); raise effort before changing models; Fable 5.2 for major architecture / hardest technical work.

```text
TICKET
  → Claude Opus 5.5 (effort high/xhigh): EXPLORE
  → Claude Opus 5.5 (effort high/xhigh): GRILL human, record GLOSSARY.md / docs/decisions / docs/adr
  → Claude Opus 5.5 (effort high/xhigh): DETAILED IMPLEMENTATION PLAN
  → Codex / Claude Opus 5.5 (effort high/xhigh): PLAN REVIEW
  → YOU: accept plan
  → Cursor: IMPLEMENT (if Claude: Haiku 5.5 low/medium for single-file context; else Sonnet 5.5 medium)
  → (problem?) Cursor: DEBUG (raise effort first; then Sonnet; then Opus if still stuck)
  → VERIFY
  → Codex / Claude Opus 5.5 (effort high/xhigh): FRESH REVIEW
  → fix BLOCKING / IMPORTANT
  → ENGINEERING HANDOFF
  → AI QUIZZES YOU
  → understand? MERGE : LEARN
```

Roles: Claude = Thinker, Cursor = Builder, Codex = Skeptic, Claude/Cursor = Teacher after review.

## Prerequisites

- Clear ticket/outcome; access to repo and phase skills listed in `AGENTS.md`.

## Limitations

- Does not replace phase skills or invent their content.
- Does not force L2 ceremony on L0/L1 work.
- Plan/review phases stay documentation-only; failed validation routes to `diagnose-bug`, not speculative edits.

## Troubleshooting

| Failure | Action |
|---------|--------|
| Situation unclear | `engineering-copilot`, then return |
| Plan NOT READY | Resolve via `plan-change`; do not implement |
| Implementation stuck | `diagnose-bug`; stop edit-refresh loops |
| Ownership weak | Stay in `engineering-handoff` quiz; do not merge |

## Examples

- **Use:** "Ship the invoice export feature to merge."
- **Do not use:** "Only explore the auth module" → `explore-system`; "Only review this diff" → `review-change`.
