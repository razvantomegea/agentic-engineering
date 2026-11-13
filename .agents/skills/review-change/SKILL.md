---
name: review-change
description: >-
  Use for plan readiness, PRs, branch diffs, or post-implementation review.
  Adversarial evidence-based review of spec, standards, and verification.
  Documentation only — never execute code or checks.
---

# Review Change — Prove What You Can, Challenge What You Cannot

Act as a skeptical, independent engineer, preferably with fresh context. Find **real, consequential defects**, not a quota of findings. Challenge the author's explanation using the specification, accepted decisions, actual code, callers, and supplied verification results. A clean review is a valid outcome.

Central question: **What must always be true, and can this plan or implementation violate it?**

## 0. Documentation-only boundary

Review is documentation-only (see `AGENTS.md` Phase boundary): read files/diffs/logs, ask questions, write review docs — never execute code, checks, scripts, or installs, and never edit source, tests, config, dependencies, or the implementation plan. Suggested patches and commands are *inert review documentation*. A request to fix findings is a **phase transition** (send to `plan-change` or `implement-change`), not permission to fix while reviewing. Attribute evidence; never claim to have run a check.

## 1. Establish the review contract

### Mode

- **Plan:** assess a proposed plan before coding. Read the plan, linked decisions, baseline code, and `../plan-change/PLAN-TEMPLATE.md`. Do not require an implementation diff.
- **Implementation:** assess the actual changes against the accepted plan/requirements. If no plan was required, use the request/issue; do not invent a missing-plan defect for small changes.
- **Both:** report each mode separately. Plan readiness never proves implementation correctness.

### Scope and baseline

Report: requested scope, baseline (commit/branch/merge-base), reviewed head, uncommitted changes when accessible, relevant files, exclusions. Honor the user's baseline; otherwise choose a sensible one and state it. Expand beyond changed lines only along relevant dependency/data/control paths.

### Authority order

1. Explicit user instructions and accepted plan/decisions.
2. Originating issue/spec and acceptance criteria.
3. Repo product docs (`README`, `docs/`, ADRs).
4. Engineering rules (`AGENTS.md`, CONTRIBUTING, etc.).
5. Existing behavior/tests and nearby patterns.

Flag contradictions between higher authority and safety. If there is no usable spec, mark requirements coverage unknown and ask only decisions that affect the verdict.

## 2. Three independent axes

Keep findings on their **primary** axis; do not duplicate.

### A. Specification and behavioral correctness

Check missing/partial requirements, conflicting decisions, inaccurate contracts, unintended side effects, regressions.

Derive testable **invariants** where useful (safety, state/ordering, data integrity, interface/compatibility, progress/liveness): **given → operation → required outcome**. Attempt to falsify with realistic counterexamples (boundaries, duplicates, retries, races, stale async, unauthorized callers, rollback). Label unverified assumptions as hypotheses; report unverified risks separately from confirmed defects.

### B. Repository standards and human maintainability

Cite actual documented rules. Assess behavioral home, navigation cost, cohesion, pass-through layers, state ownership, change amplification, unjustified abstraction. Use code smells as investigation prompts, never automatic violations — report only when you can show comprehension/correctness/change cost and the smallest fix.

Check code and planned code against the Code Simplicity Contract ([SIMPLICITY.md](../implement-change/SIMPLICITY.md)) and cite the rule (`F-04 IMPORTANT · Standards · Simplicity rule 2`). A finding must name the location, the rule, and where a fresh reader stalls or what breaks; taste alone is not a finding. Default severities:

- **IMPORTANT:** speculative structure (rule 1); normal flow not followable top-to-bottom from the diff and the unchanged code it touches (rule 2); code or names shortened to save tokens (rule 7); **missed reuse** of business or non-trivial logic that already exists with the same meaning — name the existing symbol/path (rule 9); a bug fix that handles only the triggering value, not the root-cause class (rule 10 — tag Spec when you can name a sibling input that still fails).
- **OPTIONAL:** everything else in the contract (rules 3–6, 8, rule 10 outside bug fixes, incidental-syntax duplication, inlined values); raise to IMPORTANT only with a demonstrated comprehension or correctness cost.

### C. Verification evidence and confidence

Ledger labels for **critical** requirements/invariants:

- **PROVEN** — machine-checked proof + assumptions + artifact/revision.
- **TESTED** — supplied check result at a relevant revision for a specified scenario.
- **STATICALLY SUPPORTED** — inspection supports it under listed assumptions.
- **VIOLATED** — concrete reachable counterexample.
- **UNKNOWN** — missing/contradictory/not assessable.

These are evidence labels, not overall correctness. **UNKNOWN is not a terminal state for a critical invariant:** name the verification that resolves it, or record the engineer's explicit risk acceptance. Propose proportionate proof obligations for high-risk logic; their execution belongs to a separate verification phase.

## 3. Depth proportional to risk

- **L0:** requested behavior, obvious regression, local standards — short.
- **L1:** changed behavior, failure paths, notable invariants, affected tests.
- **L2:** state/concurrency/failure sequences, compatibility, security, critical ledger.
- **L3:** cross-boundary ownership, migration/rollout/rollback, unresolved proof obligations.

Escalate by risk (auth, payments, deletion, migrations, distributed state), not file count.

## 4. Plan mode — decision-complete?

Mentally walk implementation without executing:

1. Trace each requirement → decisions, edits, samples, steps, checks; flag gaps/conflicts.
2. Verify existing paths/APIs against baseline; label proposed ones.
3. Walk one success path and each material failure/timing/retry path.
4. Reject consequential `TODO`/`...`/"handle errors" gaps in snippets.
5. Steps must be dependency-ordered and actionable without inventing product decisions.
6. Apply all three axes to design and planned evidence (lifecycle, security, rollout).
7. Question provenance: recommendations ≠ answers; unresolved technical facts stay open; records on disk.
8. Challenge critical invariants with concrete scenario traces.

**Verdict:** `READY` only with no BLOCKING/IMPORTANT findings and settled decisions. Else `NOT READY` with the minimum missing choice/correction/evidence. Send product decisions back to `plan-change`.

## 5. Implementation mode — does the diff satisfy the contract?

1. Compare scoped diff to requirements, plan, decisions, standards; call out unapproved deviations.
2. Trace entry → owner → consumers → boundaries → results.
3. Enumerate critical invariants; attempt falsifying scenarios against real guards.
4. Inspect tests and supplied verification logs; note revision mismatches.
5. Assess maintainability and the Simplicity Contract from demonstrated costs.
6. Established defects in findings; hypotheses/needed checks under residual risk.

Missing execution evidence → **STATIC REVIEW COMPLETE — VERIFICATION PENDING**, not a pass claim.

## 6. Findings format

Before writing a finding: introduced or materially affected by this change? Evidence + realistic impact? Actionable, non-duplicative, in scope?

Severities: **BLOCKING** (security/correctness/data-loss or plan contradictions that block safe implementation) · **IMPORTANT** (substantial gap likely to cause defects, or a §2B Simplicity default) · **OPTIONAL** (low-risk refinement; omit nitpicks). Missing verification alone is normally a confidence limit, not BLOCKING.

Each finding:

- **ID / severity / axis** (e.g. `F-01 BLOCKING · Spec`)
- **Location** — path/symbol or plan section; cite requirement/rule
- **Evidence** — code, diff, doc, or supplied log
- **Counterexample / impact** — concrete input/sequence (preconditions → trigger → path → expected vs actual); maintenance cost when standards-related
- **Smallest fix**
- **Verification** — regression scenario or evidence for the execution phase

Say **No actionable findings** when appropriate.

## 7. Output contract

1. **Scope** — mode, baseline/head, spec/standards sources, access limits.
2. **Verdict** — plan `READY`/`NOT READY`; implementation `STATIC REVIEW COMPLETE`/`INCOMPLETE` (+ `VERIFICATION PENDING` when relevant). Not runtime certification.
3. **Findings** — severity-ordered; tagged Spec / Standards / Evidence.
4. **Invariant / counterexample summary** — critical properties with evidence labels; **required for L2–L3**. Omit for trivial work with no material invariants.
5. **Human navigation and cohesion** — behavioral home and essential path, or `No material concern`.
6. **Verification and residual risk** — attributed results, missing checks, next steps.

Success = accurate useful judgment — not a long report or criticism quota.
