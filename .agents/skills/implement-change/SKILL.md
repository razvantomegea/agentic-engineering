---
name: implement-change
description: >-
  Use during implementation, not planning-only or review-only work. Builds
  accepted changes with one behavioral home, minimal indirection, concise
  updates, and evidence-backed verification.
---

# Implement Change — Correct Code, Minimum Waste

Produce correct, verifiable, human-readable software with the fewest necessary concepts. Follow the accepted plan and repository conventions. **Save tokens by removing repetition and irrelevant work, never by hiding uncertainty, skipping required checks, or making code cryptic.**

## 0. Operating contract

- **Plan is the contract.** For **L1**, the agreed **inline plan** in chat is the contract. For **L2–L3**, read the accepted plan and linked decisions **from disk** before editing — not from a chat summary. Confirm recorded plan review/acceptance for L2–L3. Trivial L0 retains implement → verify.
- **Repository evidence wins over stale examples.** Confirm paths, symbols, dependencies, and contracts before editing. Pseudocode is intent, not paste-ready code.
- **Preserve scope.** Do not silently change product behavior, public contracts, state ownership, error policy, or rollout. Material gaps → return to `plan-change`. Continue independent safe work if possible.
- **Respect `AGENTS.md`.** Do not use token savings to bypass permissions or verification.
- **Implement; don't re-plan by default.** Ask only when a missing consequential choice blocks the step.

## 1. Efficient context acquisition

1. Read the plan (inline or on disk), scoped requirements, and relevant decisions once. Extract a compact working map: **step, behavioral home, paths, contract/invariants, checks, risks**. Don't echo the entire plan.
2. Inspect the owner, direct callers, interfaces, existing tests, and necessary boundaries. Discover names before opening unrelated directories.
3. Prefer targeted reads, relevant diffs, and bounded search. Expand only when a dependency, failure path, or unexpected result justifies it.
4. Reuse facts already inspected. Re-read after edits or conflicting evidence.
5. Inspect tool errors and the smallest useful failing output first.

**Never optimize away necessary context.** Read complete relevant functions when snippets would hide control flow or side effects.

## 2. Small, coherent implementation loop

For each accepted plan step:

1. **Locate** — confirm code and edit point.
2. **Change** — smallest coherent behavior, including required failure/edge cases.
3. **Check** — narrowest relevant authorized check; record why if deferred.
4. **Update** — mark step and evidence; never claim success from an unrun check.
5. **Continue** — escalate unexpected architecture/behavior/contract changes to the plan.

If a check fails, establish the cause before another change. Never weaken tests to make an implementation pass.

## 3. One obvious behavioral home

Existing repository conventions win; apply this guidance where no pattern exists.

- Keep feature rules, invariants, validation, transitions, orchestration, and feature-specific failures close when cohesive.
- Prefer an existing owner with a small public API. Introduce a class/service only for real state/lifecycle/orchestration value.
- Keep local pure calculations as private helpers. Don't spawn `Service → Helper → Utils → Strategy` chains without distinct responsibilities.
- Every new file must repay navigation cost through a real concern.
- Avoid god managers, pass-through adapters, speculative options, and unrelated refactors.
- DRY business knowledge, not incidental syntax. **Never compress production code or erase comments merely to save response tokens.**

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
- Durable artifacts (code, tests, commits, handoff docs) stay professionally readable even when chat is terse.

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
5. **Simplicity** — can an added file/wrapper/option be removed without loss?
6. **Scope** — unrelated files/boundaries intact; names match conventions?
7. **Verification** — which checks passed/failed/not run at this revision?

This self-review does not replace independent `review-change` when required.

## 7. Concise, evidence-backed completion

- **Changed:** primary behavioral home + one-line normal flow; other files when not obvious.
- **Why:** material design choices or plan deviations.
- **Verified:** exact checks and results with evidence labels; distinguish checks performed here from supplied evidence.
- **Remaining:** risks, blockers, checks not run with reasons.

Update plan-step status. `engineering-handoff` consolidates ownership after review.
