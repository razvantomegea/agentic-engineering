---
name: engineering-copilot
description: >-
  Use when unsure which skill applies, what to do next, or when process risk is
  unclear. Routes without ceremony that adds code. Do not use once the phase
  skill is already clear.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: [engineering, routing, process]
---

# Engineering Copilot

## Purpose

Classify the situation and route — favoring least ceremony and least new code while preserving human understanding. Do not replace phase skills. If using Claude (house): explore/plan/review → **Opus 5.5** **`high`** / **`xhigh`**; implement → **Sonnet 5.5** **`medium`**; single-file context → **Haiku 5.5** **`low`** / **`medium`**. Raise effort before switching models.

Route into the right workflow. Do not replace the phase skills.

Optimize for throughput, correctness, ownership, and low token waste. Work **with** me — not ahead of my comprehension of important behavior.

When I'm confused, don't immediately solve the problem. First help me build the smallest mental model necessary to reason about it.

## Hierarchy

```text
engineering-copilot      ← What situation am I in?
        ↓
specific workflow skill  ← How should I handle it?
        ↓
agent/tool               ← Who should do the work?
        ↓
engineering-handoff      ← Do I actually understand it?
```

## "What should I do?"

Do not prescribe implementation first. Answer with:

SITUATION → RISKS → RECOMMENDED APPROACH → WHY → NEXT ACTION

If two approaches are genuinely reasonable, give the tradeoff — not a fake universal answer.

## Routing table

Classify the situation, then load the matching skill.

| Situation | Skill / path | Note |
|-----------|--------------|------|
| A. Trivial (copy, CSS, rename, tiny fix) | `implement-change` light: implement → verify | No plan, architecture discussion, or handoff |
| B. Normal feature / isolated bug | brief `explore-system` → **inline plan** (5–10 lines: home, files, steps, checks, assumptions) → `implement-change` or `guided-implementation` → review if useful → short `engineering-handoff` | Saved `plan-change` only if requested or it grows to L2 |
| C. Significant (auth, payments, shared state, complex async) | full `ship-change` | Ownership gate required |
| D. Architecture / system design | `explore-system` → `plan-change` (+ ADR) → staged implement → `review-change` → `engineering-handoff` | Do not jump to implementation |
| E. Bug / production issue | `diagnose-bug` | No speculative edit-refresh loops |
| F. Unfamiliar code | focused `explore-system` | Explain responsibility, callers, data, state, side effects before rewriting |
| G. Code review | `review-change` (prefer Codex, fresh context) | Adversarial; BLOCKING / IMPORTANT / OPTIONAL; no cosmetic quota |
| H. Refactoring | establish problem, preserved behavior, equivalence checks first | Do not refactor for aesthetics alone |
| I. Technical debt | classify ACTIVE PAIN / LIKELY FUTURE PAIN / COSMETIC | Prioritize ACTIVE PAIN |
| J. Performance | MEASURE → bottleneck → hypothesis → change → MEASURE | Do not optimize unmeasured intuition |
| K. Security-sensitive | raise rigor; trust boundaries, authn/z, secrets, abuse cases | UI restrictions are not security |
| L. Data model | source of truth, ownership, constraints, migration, deletion | Separate domain model from storage when useful |
| M. API design | contract, errors, idempotency, auth, retries, timeouts | Prefer boring, explicit contracts |
| N. Async / concurrency | ordering, shared state, cancellation, stale responses, retries | Do not treat async as sync |
| O. Third-party integration | our vs provider responsibility, rate limits, webhooks, fallback | SDKs must not hide important behavior |
| P. Legacy code | understand why it exists; hidden consumers; tests | Prefer characterization tests before big edits |
| Q. Unclear requirements | separate KNOWN / ASSUMED / UNKNOWN | Do not invent product behavior silently; state safe reversible assumptions |

## Stances

1. Collaboration unit = a **meaningful conceptual change**, not every file edit.
2. Do not narrate routine mechanical work; surface changes to behavior, ownership, flow, invariants, assumptions, failure modes, tradeoffs.
3. Match implementation pace to human comprehension of important behavior.
4. Just-in-time teaching: CONCEPT → WHY → HOW → HERE → FAILURE MODE — then return to the task.
5. If understanding looks weak, quiz — do not re-explain everything (`engineering-handoff`).
6. Explain at SYSTEM → MODULE → FLOW → DECISION; zoom to lines only when they matter.
7. Rigor scales with risk (blast radius, security, money, data loss, hard-to-reverse). Skip ceremony for local reversible work.
8. Prefer routes that write less code and keep the engineer able to explain the change ([SIMPLICITY.md](../implement-change/SIMPLICITY.md)).

## Prerequisites

- A user ask or ticket; awareness of available phase skills.

## Limitations

- Routing only — does not implement, review, or plan in place of the matched skill.
- Do not invent product requirements to force a path.

## Troubleshooting

| Failure | Action |
|---------|--------|
| Two paths look equal | State tradeoff; recommend the smaller-code / clearer-ownership path |
| User confused mid-task | Smallest mental model first; then resume routing |
| Over-ceremony on L0 | Route to implement → verify only |

## Examples

- **Use:** "What should I do next on this auth bug?"
- **Do not use:** Already clear "implement the accepted plan" → `implement-change` directly.
