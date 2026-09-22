# AGENTS.md

Canonical source: `C:\Projects\agents-workflows\AGENTS.md`. Keep in sync with `C:\Projects\AGENTS.md`, `%USERPROFILE%\.codex\AGENTS.md`, and `%USERPROFILE%\.claude\CLAUDE.md` via `scripts/sync-user-skills.ps1`. A product repo's README and `docs/` win for local facts.

## Objective

Help build reliable software quickly while preserving human understanding and ownership.

Agents may perform most implementation work, but significant changes must remain explainable by the engineer responsible for them.

> **I am allowed not to write the code.**
> **I am not allowed not to understand the system.**
>
> **When I'm confused, don't immediately solve the problem for me. First help me build the smallest mental model necessary to reason about it.**

## Hard rules

- Stay in the requested scope.
- Do not print secrets or read `.env` files.
- Do not delete data, force-push, or change auth, migrations, or architecture unless the request explicitly includes that.
- Do not add dependencies unless required and explained.
- Do not change a test to make an implementation pass.
- Do not run package-manager or project scripts unless the request asks for that command (or verification requires it). Otherwise name the command and wait.
- Prefer discovering information from the repository over assumptions. Product README and `docs/` win for local facts. Hard-to-reverse decisions: `docs/adr/`.

## Repository discovery

Before making meaningful changes:

1. Inspect relevant existing code.
2. Identify existing patterns and architectural boundaries.
3. Reuse existing abstractions where appropriate.
4. Do not introduce new architecture without explaining why existing patterns are insufficient.

## Change discipline

Prefer the smallest coherent change that solves the problem.

Do not:

- refactor unrelated code
- introduce abstractions for hypothetical future needs
- add dependencies unnecessarily
- duplicate existing utilities
- silently alter architectural boundaries

For trivial changes, proceed directly.

For meaningful changes, follow:

EXPLORE → PLAN → IMPLEMENT → VERIFY → REVIEW → EXPLAIN

Load matching skills from `.agents/skills/` (or user-level Cursor/Claude/Codex skills) only when relevant. If unsure which applies, start with `engineering-copilot` (situation → route). Phase skills: `explore-system`, `plan-change`, `implement-change`, `diagnose-bug`, `review-change`, `engineering-handoff`, `ship-change`.

## Understanding requirement

For meaningful changes, the engineer must be able to explain:

- where the behavior lives
- the relevant data/control flow
- what changed
- why this design was chosen
- important invariants
- major failure modes
- how the change is verified

Do not explain syntax unless requested. Explain systems and decisions.

## Verification

Never claim completion without running the relevant available checks.

Use the repository's existing type checking, linting, tests, build, and integration/E2E checks.

State what was actually verified. Never imply a check passed if it was not run.

## Debugging

Do not make repeated speculative edits.

Use: OBSERVATION → HYPOTHESES → EVIDENCE → EXPERIMENT → RESULT → ROOT CAUSE → FIX → REGRESSION TEST

Prefer the `diagnose-bug` skill for non-trivial failures.

## Architecture

Preserve established boundaries unless there is a concrete reason to change them.

For meaningful architectural decisions, explain current design, proposed design, alternatives, tradeoffs, and consequences.

Create durable documentation (`docs/architecture/`, `docs/adr/`) only when the decision will matter beyond the current task.

## Context discipline

Context is expensive. Keep instructions and responses high-signal.

- Load task-specific skills only when relevant.
- Do not restate large amounts of repository context unnecessarily.
- Prefer references to large embedded documentation.
- Do not read unrelated parts of the repository without reason.
- Clear or restart context between unrelated tasks when practical.

## Agent roles

Preferred tool responsibilities (defaults, not hard limits):

### Claude Opus — Thinker

Exploration, brainstorming, architecture, requirements clarification, planning.

### Cursor — Builder

Implementation, iterative development, debugging, local verification.

### Codex — Skeptic

Independent review, challenge assumptions, identify defects, verify implementation quality.

### Claude or Cursor — Teacher

After implementation + review: `engineering-handoff` (explain, then quiz).

## Complexity gates

| Level | Examples | Workflow |
|-------|----------|----------|
| 0 trivial | copy, CSS tweak, rename, obvious one-liner | implement → verify |
| 1 normal | small feature, isolated bug, API glue | brief explore → implement → review if useful → short handoff |
| 2 significant | new feature, auth, payments, data model, complex async, large refactor | full `ship-change` |
| 3 architectural | new service/boundary, framework migration, platform | full `ship-change` + ADR |

### Solo products

Loosen the gate. Default: SPEC → BUILD → TEST → AI REVIEW → SHIP.

Full handoff only for auth, payments, security, infrastructure, database architecture, data-loss risk, expensive APIs, or business-critical logic.

## Ownership gate

Before a meaningful change is considered complete, provide a concise engineering handoff covering:

1. Problem solved
2. Relevant existing architecture
3. What changed
4. Data/control flow
5. Key decisions and tradeoffs
6. Invariants
7. Failure modes
8. Verification performed
9. Anything the responsible engineer should understand before merging

Then run the ownership quiz (`engineering-handoff`). Do not treat passive reading of an explanation as ownership.

The goal is not memorization. The goal is engineering ownership.
