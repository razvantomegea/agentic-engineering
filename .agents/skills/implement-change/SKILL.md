---
name: implement-change
description: >-
  Use during implementation, not planning-only or review-only work. Builds
  accepted changes with least code, one behavioral home, and verified results.
  Do not use for planning or review-only passes.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: [engineering, implementation, simplicity]
---

# Implement Change — Correct Code, Minimum Waste

## Purpose

Ship the accepted change with the **least code** that stays correct, verifiable, and readable by a human who did not see this chat. Prefer reuse and deletion over new surface. Follow [SIMPLICITY.md](SIMPLICITY.md). If using Claude (house): single-file / single-file context → **Haiku 5.5** **`low`** / **`medium`**; otherwise **Sonnet 5.5** **`medium`**. Raise effort before switching models. (Blog: well-scoped coding → Sonnet; Haiku → short prompts / simplest high-volume, not judgment-heavy multi-file edits.)

Produce correct, verifiable, human-readable software with the fewest necessary concepts. Follow the accepted plan and repository conventions. **Save tokens by removing repetition and irrelevant work, never by hiding uncertainty, skipping required checks, or making code cryptic.**

## 0. Operating contract

- **Plan is the contract.** For **L1**, the agreed **inline plan** in chat is the contract. For **L2–L3**, read the accepted plan **from disk** — not from a chat summary — and confirm its recorded review and acceptance. Execute its Part B (Do) with Part A §1 (scope, preserve, risks) in view; read the rest of Part A only for the IDs a step cites. Trivial L0 retains implement → verify.
- **Verify, don't guess.** Confirm paths, symbols, dependencies, and contracts before editing. Import only modules the repository or its manifest already provides, and call third-party APIs only as their installed version defines them. Pseudocode is intent, not paste-ready code. If the repository contradicts the plan, follow the plan's stop conditions.
- **Preserve scope.** Do not silently change product behavior, public contracts, state ownership, error policy, or rollout. Material gaps → return to `plan-change`. Continue independent safe work if possible.
- **Respect `AGENTS.md`.** Do not use token savings to bypass permissions or verification.
- **Implement; don't re-plan by default.** Ask only when a missing consequential choice blocks the step.

## 1. Efficient context acquisition

1. Read the plan (inline or on disk) once. For a saved plan, run its preflight (Part B §5) before the first edit: anchors match once, commands exist, dependency versions match, pre-existing failures recorded. Extract a compact working map: **step, behavioral home, paths, contract/invariants, checks, risks**. Don't echo the entire plan.
2. Inspect the owner, direct callers, interfaces, existing tests, and necessary boundaries. Discover names before opening unrelated directories.
3. Prefer targeted reads, relevant diffs, and bounded search. Expand only when a dependency, failure path, or unexpected result justifies it.
4. Reuse facts already inspected. Re-read after edits or conflicting evidence.
5. Inspect tool errors and the smallest useful failing output first.

**Never optimize away necessary context.** Read complete relevant functions when snippets would hide control flow or side effects.

## 2. Small, coherent implementation loop

For each accepted plan step:

1. **Locate** — confirm code and edit point; before adding a non-trivial function, type, or constant, run the reuse scan (SIMPLICITY rule 9).
2. **Change** — smallest coherent behavior, including required failure/edge cases.
3. **Check** — narrowest relevant authorized check; record why if deferred.
4. **Update** — mark step, evidence, and any deviation against its step ID; never claim success from an unrun check.
5. **Continue** — escalate unexpected architecture/behavior/contract changes to the plan.

If a check fails, establish the cause before another change. Never weaken tests or silence checks (`any`, unchecked casts, ignore/disable comments, skipped tests) to make an implementation pass; fix the cause or report it.

## 3. One obvious behavioral home

Existing repository conventions win; apply this guidance where no pattern exists. Before writing code, read [SIMPLICITY.md](SIMPLICITY.md) — the Code Simplicity Contract `review-change` enforces, including the reuse scan (rule 9).

- Keep feature rules, invariants, validation, transitions, orchestration, and feature-specific failures close when cohesive.
- Prefer extending an existing owner with a small public API; new code starts in the simplest form (rule 1).
- Keep local pure calculations as private helpers. Don't spawn `Service → Helper → Utils → Strategy` chains without distinct responsibilities.
- Every new file must repay navigation cost through a real concern.
- Avoid god managers, pass-through adapters, and unrelated refactors. Never compress production code or erase comments to save response tokens (rule 7).

### Framework integration

Adapters focus on UI, transport, scheduling, or lifecycle. One explicit state owner with reliable observation/cleanup. In React, hooks may own UI state; external owners need correct subscriptions and stable snapshots.

## 4. Token-efficient communication

**Technical substance stays; ceremony goes.** Terse for routine progress; full sentences for design decisions, risks, irreversible actions, security, and merge-relevant facts.

| Kind | Example |
|------|---------|
| Terse (routine) | "Step S-03 done. `SearchManager.search` sequence guard in place. Next: wire hook." |
| Full (irreversible/security) | "This migration drops column `legacy_token`. Existing rows cannot be restored from backup automatically. Confirm before I run it." |

- Answer/result first. Speak on phase changes, blockers, meaningful discoveries, outcomes — not every tool call.
- Smallest sufficient payload: changed lines + a little context; link paths; never ambiguously abbreviate code, commands, or errors.
- Durable artifacts (code, tests, commits, handoff docs) stay at full readability even when chat is terse (SIMPLICITY rule 7).

## 5. Risk-based verification

Use targeted checks per increment and the **relevant complete verification** before done. Prefer established repo commands; follow `AGENTS.md` execution permissions.

- **Trivial/local:** focused test or type/lint as applicable.
- **Behavioral/stateful:** unit/integration + negative cases, transitions, regressions.
- **Cross-boundary/high-risk:** security, concurrency, persistence, payment, migration, public contract, E2E/build as appropriate.

Never skip a necessary check solely to reduce tokens. For each important invariant, report evidence with the shared labels from `review-change`: **TESTED**, **STATICALLY SUPPORTED**, or **UNKNOWN** (with reason and outstanding command). Attribute results to phase and revision. Stale evidence is not a pass.

## 6. Mandatory self-review before handoff

1. **Behavior** — matches accepted spec, invariants, failure paths, recorded deviations?
2. **Navigation** — one obvious primary home; short entry → boundary trace?
3. **Cohesion** — related decisions not fragmented; owner not absorbing unrelated domains?
4. **State** — source of truth, lifetime, notifications, concurrency, cleanup?
5. **Simplicity** — can an added file/wrapper/option be removed without loss? Can someone who has not seen this conversation follow the normal flow top-to-bottom from the diff and the unchanged code it touches, without guessing intent (rule 2)? Simplify the specific hop where a fresh reader would stall.
6. **Reuse** — each non-trivial new symbol searched for an existing equivalent (rule 9); no domain values inlined that the repo already externalizes (rule 10)?
7. **Scope** — unrelated files/boundaries intact; names match conventions?
8. **Verification** — which checks passed/failed/not run at this revision?

This self-review does not replace independent `review-change` when required.

## 7. Concise, evidence-backed completion

- **Changed:** primary behavioral home + one-line normal flow; other files when not obvious.
- **Why:** material design choices or plan deviations.
- **Reuse:** for non-trivial new symbols, called/extended existing vs created new and where you searched (rule 9).
- **Verified:** exact checks and results with evidence labels; distinguish checks performed here from supplied evidence.
- **Remaining:** risks, blockers, checks not run with reasons.

Update plan-step status. `engineering-handoff` consolidates ownership after review.

## Prerequisites

- Accepted plan (inline L1 or on-disk L2–L3) or an L0 request with clear scope.
- Permission to run the verification commands the plan/repo requires.

## Limitations

- Do not re-plan or expand architecture without returning to `plan-change`.
- Do not weaken tests or silence checks to make a change pass.
- Chat terseness must never make production code cryptic (SIMPLICITY rule 7).

## Troubleshooting

| Failure | Action |
|---------|--------|
| Plan conflict with repo | Follow plan stop conditions; escalate to `plan-change` |
| Check fails after edit | Establish cause before another change; use `diagnose-bug` if stuck |
| Missing consequential choice | Ask once; do not invent product behavior |
| Speculative new files/layers | Delete them; extend the existing owner (SIMPLICITY rules 1, 8–9) |

## Examples

- **Use:** "Implement the accepted plan for search debounce."
- **Do not use:** "Review this PR" → `review-change`; "What should we build?" → `plan-change`.
