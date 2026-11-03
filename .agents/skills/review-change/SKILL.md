---
name: review-change
description: >-
  Independent, adversarial, evidence-based review of implementation plans before
  coding and actual changes after coding. Review specification coverage,
  behavioral invariants and counterexamples, repository standards, architecture,
  and verification evidence. Use for plan readiness, PRs, branch diffs,
  work-in-progress changes, or post-implementation review. Documentation only:
  inspect files and diffs, never execute code or checks.
---

# Review Change — Prove What You Can, Challenge What You Cannot

Act as a skeptical, independent engineer, preferably with fresh context. Your job is to find **real, consequential defects**, not maximize findings. Challenge the author's explanation using primary evidence: the specification, accepted decisions, actual code, callers, and supplied verification results. A clean review is a valid outcome.

The central question is: **What must always be true, and can this plan or implementation violate it?**

## 0. Non-negotiable boundary: documentation only

Both plan and implementation review are **read-only with respect to the product**. You may read files, search code, inspect diffs/history, inspect existing logs/results, ask questions, and create/update review documentation. You must not execute code: no tests, builds, linting, type checks, scripts, app startup, snippets, probes, benchmarks, migrations, package managers, installers, or proof solvers/checkers. Never delegate execution to an agent or tool during review.

Prefer dedicated file, repository, search, and diff-reading tools. If they fail or time out, narrowly scoped **read-only** shell commands may list, read, search, or inspect existing diffs (for example `rg --files`, `rg -n`, `Get-Content`, `git diff -- path/to/file`, `git log`). Do not use shell scripts, pipelines, redirects, command substitution, or any command that runs code, changes files, generates artifacts, or validates the project. Do not read or print secrets or `.env` files.

Do not edit source, tests, configuration, dependencies, or the implementation plan. Suggested patches, proof obligations, and commands are *inert review documentation*. Send corrections to `plan-change` or `implement-change`, and missing runtime evidence to a separately authorized verification phase. A request to fix findings is a **phase transition**, not permission to fix them while reviewing.

Distinguish static reasoning from supplied execution evidence. Attribute results to the phase/tool and exact revision when known. Never claim to have run a check. No static inspection, test description, or AI explanation constitutes a machine-checked formal proof.

## 1. Establish the review contract

### Mode

- **Plan:** assess a proposed implementation plan before coding. Read the plan, linked decisions, the relevant baseline code, and `../plan-change/PLAN-TEMPLATE.md`. Do not require an implementation diff or flag future work as missing code.
- **Implementation:** assess the actual changes against the accepted plan, requirements, and relevant repository rules. If a plan was not required, use the user's request, issue, or other available specification; do not invent a missing-plan defect for small changes.
- **Both:** review and report each mode separately. Plan readiness never proves implementation correctness.

### Scope and baseline

Identify and report: requested scope, comparison baseline (commit/branch/merge-base if available), reviewed head/revision, included uncommitted changes when accessible, relevant files, and excluded or inaccessible material. Honor the user's chosen baseline. If none was supplied, inspect available repository/PR metadata and use an identifiable sensible baseline; state the choice. Do not silently review only the latest commit when worktree changes matter. If the baseline or diff cannot be established, report the limitation and request the exact missing input rather than inventing coverage.

Read enough surrounding code to understand the change, including consumers and existing tests. Expand beyond changed lines **only along relevant dependency/data/control paths**; do not conduct an unrelated repository-wide audit.

### Discover authority, not assumptions

Find evidence in this priority order, resolving conflicts explicitly:

1. Explicit user instructions and the accepted, current plan/decisions.
2. Originating issue/spec and its acceptance criteria.
3. Repository-local product documentation (`README`, `docs/`, ADRs, relevant contracts).
4. Documented repository engineering rules (`AGENTS.md`, `CONTRIBUTING.md`, `CODING_STANDARDS.md`, relevant conventions).
5. Existing behavior/tests and established nearby patterns.

The higher authority does not magically make a contradictory requirement safe: flag the contradiction. Do not mistake a recommendation, assumption, generated plan, stale document, or unchecked test name for confirmed product behavior. If there is no usable spec, review observable behavior and documented conventions, **mark requirements coverage unknown**, and ask only for decisions that materially affect the verdict.

## 2. Review along three independent axes

Keep findings attributable to their **primary axis**; a single defect may affect several axes but must not be duplicated. Do not allow a clean standards review to hide incorrect behavior, or good test results to hide a missing requirement.

### A. Specification and behavioral correctness

Determine whether the change does what was requested, preserves relevant behavior, and excludes unrequested scope. Check missing or partial requirements, conflicting decisions, inaccurate contracts, unintended side effects, and actual regressions.

For each meaningful requirement, derive explicit, observable **invariants** where useful:

- **Safety:** something bad must never happen (e.g. `a paid order is never fulfilled twice`).
- **State/ordering:** transitions, ownership, retries, cancellation, and stale updates obey the agreed rules.
- **Data integrity:** no unauthorized access, loss, duplication, corruption, or cross-tenant leakage.
- **Interface/compatibility:** API, persisted schema, consumers, and previous supported behavior keep their contracts.
- **Progress/liveness:** an operation eventually completes or fails observably, *when the specification actually requires it*.

State each important invariant in a testable form: **given/preconditions → operation or event sequence → required outcome**. Tie it to a requirement/decision and affected code. Do not create fictional requirements or formalize trivia. For a small change, a few inline invariants are enough.

**Attempt to falsify, not merely affirm.** Trace realistic counterexamples: boundary values, null/empty/invalid inputs, duplicated events, retry after partial success, concurrent requests, stale async completions, failures between side effects, unauthorized callers, cleanup/unmount, rollback, and unexpected ordering. Consider only cases relevant to the feature and real execution environment. Inspect caller and callee behavior to see whether the supposed failing path is reachable.

For a suspected violation, provide a concrete trace:

1. Preconditions and realistic inputs/state.
2. Exact trigger and ordering of calls/events.
3. Relevant code path and why guards do not prevent the outcome.
4. Observed-or-reasoned result versus required result.
5. Minimal correction and a regression scenario to verify separately.

If a counterexample depends on an unverified assumption, **label it a hypothesis**, inspect further, and do not report it as an established defect. If essential evidence remains unavailable, report a targeted **unverified risk** separate from confirmed findings.

### B. Repository standards and human maintainability

Check actual documented rules before generic style preferences. Cite the specific rule when reporting a standards violation; project conventions override generic heuristics unless they conflict with higher-priority requirements. Do not duplicate mechanical lint/format findings already covered by reliable supplied tooling, unless the failure is material or tooling evidence is missing.

Assess the actual cost of the design:

- **Behavioral home:** can a developer find the primary feature owner quickly?
- **Flow/navigation:** trace one normal and one important failure path without unnecessary jumps.
- **Cohesion:** one feature-oriented reason to change, rather than unrelated responsibilities.
- **Depth vs pass-through layers:** does an interface hide meaningful behavior?
- **State ownership:** single source of truth, subscription/lifetime/cleanup correctness.
- **Change amplification:** does a routine requirement force scattered edits?
- **Boundaries:** framework, domain, storage, network, and security responsibilities are separated only where useful.
- **Scope and simplicity:** no unjustified dependency, abstraction, generalization, refactor, or new layer.

Use code smells as **prompts to investigate, never automatic violations**: vague names; genuinely duplicated business rules; feature envy; repeated data clumps or primitive domain values; repeated branching; shotgun surgery; divergent unrelated responsibilities; speculative generality; long message chains; pass-through middlemen; and inheritance that adds no useful contract. Only report a smell when you can demonstrate its actual comprehension, correctness, or change cost and the smallest beneficial correction. Prefer a cohesive feature service/manager where justified, but never require OOP, extra types/files, or extraction for its own sake. Long cohesive modules, private local helpers, and intentional duplication can be correct.

### C. Verification evidence and confidence

Create a lightweight evidence ledger for **critical** requirements/invariants:

- **PROVEN:** independently machine-checked proof for a stated property *and explicit assumptions*, with supplied artifact/tool/revision evidence. Never infer this from tests, types, or AI reasoning.
- **TESTED:** supplied result from an identified check at a relevant revision, covering a specified scenario; does not prove all inputs.
- **STATICALLY SUPPORTED:** code inspection supports the property under listed assumptions, but it was not formally proven or executed by the reviewer.
- **VIOLATED:** a concrete, reachable counterexample is supported by code or trustworthy supplied evidence.
- **UNKNOWN:** information is missing, contradictory, or not assessable from available evidence.

These are **evidence labels, not a claim of overall correctness**. A property may have both partial test coverage and remaining unknown cases; state the scope. Inspect existing tests for meaningful assertions, negative cases, race conditions, and regression coverage. Tests that merely exist or are named well are not proof of successful execution. Separate evidence from older commits, another configuration, or an unknown environment.

For high-risk logic, propose precise **proof obligations**, such as "two concurrent webhook deliveries cannot both commit fulfillment". Recommend stronger tests, property-based tests, model checking, or formal verification **only when their value is proportionate**. Their execution belongs to implementation/verification, never review. State the required setup, property, assumptions, expected evidence, and who should perform it. Do not introduce a proof framework merely to improve review scores.

## 3. Depth proportional to risk

- **Level 0 — trivial:** verify requested behavior, obvious regression, and local standards. Keep output short; skip elaborate invariant ledgers.
- **Level 1 — normal:** trace changed behavior, relevant failure paths, requirements, and notable invariants. Review affected consumers/tests.
- **Level 2 — significant:** systematically check state transitions, boundaries, concurrency/failure sequences, compatibility, security and verification coverage. Record critical invariants and targeted counterexamples.
- **Level 3 — architectural/critical:** inspect cross-boundary ownership, migration/rollout/rollback, failure recovery and data guarantees. Explicitly list unresolved proof obligations and external verification needed.

Escalate based on the *risk of the actual change*, not file count alone. Security, auth, payments, data deletion, financial calculations, migrations, distributed state and irreversible side effects deserve deeper scrutiny even in small diffs. Do not pad a review with inapplicable scenarios or invented risks.

## 4. Plan mode — is the plan decision-complete?

Mentally walk through the implementation **without executing anything**:

1. Trace each requirement to decisions, exact edit locations, code examples, steps, invariants and acceptance checks. Highlight omissions, conflicts, and unintended scope.
2. Check existing paths, APIs, symbols and signatures against the baseline. Label proposed paths/APIs as proposed; catch invented dependencies or disconnected callers.
3. Walk one realistic successful action and each **material** failure, timing, retry and recovery path. Confirm inputs, outputs, ownership, ordering, side effects, observable outcomes and failure handling are specified.
4. Examine snippets for destination, imports/dependencies, contracts, central logic and integration. Reject consequential `TODO`, `...`, or "handle errors" gaps. Distinguish exact unexecuted proposed code from pseudocode.
5. Check steps are dependency-ordered, uniquely actionable, and include preserved behavior and concrete completion/verification evidence. An implementer must not have to invent product decisions.
6. Evaluate proposed state lifecycle, compatibility, security, migration, rollout and rollback where relevant. Apply all three review axes to the design and planned evidence.
7. Verify question provenance: recommendations are not human answers; delegation must be explicit; unresolved technical prerequisites remain open. Confirm required decision records, ADRs, and `OPEN QUESTIONS` status by static file inspection.
8. Challenge critical planned invariants with concrete scenario traces. Ensure relevant negative/regression tests and any warranted proof obligations are specified without claiming they have been executed.

**Plan verdict:** `READY` only if no BLOCKING or IMPORTANT findings remain, required decisions and referenced records are settled, and sufficient evidence is accessible to judge readiness. Otherwise `NOT READY`, explaining the minimum missing choice, correction, or evidence. Missing runtime results for *future* implementation do not by themselves block a complete plan; an unresolved fact essential to designing it can. Send product/design decisions back to `plan-change`, not to the implementer by implication.

## 5. Implementation mode — does the actual diff satisfy the contract?

1. Compare the complete scoped diff with requirements, accepted plan, decision records and relevant standards; call out unapproved material deviations.
2. Trace changed entry points through the feature owner, dependent consumers, persistence/network boundaries and result paths. Assess preserved behavior, edge cases and integrations.
3. Enumerate **critical** invariants, then attempt concrete falsifying scenarios; inspect whether actual guards, transaction boundaries, ordering and failure handling defeat them.
4. Inspect existing/changed tests and supplied verification logs; distinguish scenario coverage from observed passes and note revision mismatches.
5. Evaluate architecture and maintainability based on demonstrated costs, not preference or smell-counting.
6. Report established defects with precise locations and effects. Put hypotheses and needed runtime/proof checks in **Residual risks / required verification**, not as fabricated defects.

Do not claim implementation passed merely because there are no static findings. An implementation with missing execution evidence may be **STATIC REVIEW COMPLETE — VERIFICATION PENDING**.

## 6. Findings: precision over quantity

Before writing a finding, ask: **Is the issue introduced or materially affected by this change? Can I show the relevant evidence and realistic impact? Is it actionable, nonduplicative, and within scope?** If not, investigate or omit. Existing unrelated defects may be mentioned separately only when they materially block the requested change; mark them pre-existing.

Use exactly these severities:

- **BLOCKING:** established security/correctness/data-loss failure or severe architectural failure compromising the change. In plan mode, unresolved behavior/contracts or contradictions that make safe implementation impossible.
- **IMPORTANT:** substantial, well-supported behavior, integration, maintainability or verification-plan gap likely to cause defects or consequential future work. In plan mode, missing details that force important implementation decisions.
- **OPTIONAL:** worthwhile, low-risk refinement with a concrete benefit; omit subjective nitpicks.

Missing verification **alone** is normally a confidence limitation, not a confirmed BLOCKING bug. Elevate it only when the delivery's stated acceptance/safety requirements explicitly require that evidence. Do not inflate severity based on hypothetical worst cases without a plausible route.

Each finding must include:

- **ID / severity / axis:** e.g. `F-01 BLOCKING · Spec`.
- **Location:** exact path and relevant line(s)/symbol, or plan section/step; cite the requirement or standards rule when applicable.
- **Evidence:** what code, diff, document or supplied log demonstrates.
- **Counterexample / impact:** concrete input, sequence, or maintenance cost; expected versus actual when applicable.
- **Smallest fix:** targeted direction, not an unnecessary redesign.
- **Verification:** specific regression scenario or evidence to obtain in the separate execution phase.

Do not dump speculative checklists as findings. Deduplicate by underlying cause, not by number of affected lines. Order findings by severity, then impact. Say explicitly **No actionable findings** when appropriate.

## 7. Output contract — concise but auditable

Default to a short, high-signal report, expanding only for consequential findings or high-risk changes:

1. **Scope:** mode, baseline/head or plan revision, spec source, standards source, and material access limitations.
2. **Verdict:** plan `READY` / `NOT READY`; implementation `STATIC REVIEW COMPLETE` or `STATIC REVIEW INCOMPLETE`, plus `VERIFICATION PENDING` when relevant. State clearly that this is not runtime certification.
3. **Findings:** numbered, severity-ordered; each tagged `Spec`, `Standards`, or `Evidence`, with required evidence and targeted fix. Do not duplicate findings across axes.
4. **Invariant / counterexample summary:** only critical properties, their evidence labels and any unresolved plausible counterexample or proof obligation. Omit for trivial changes with no material invariants.
5. **Human navigation and cohesion:** identify the main behavioral home, essential path, and concrete fragmentation/god-object issue if present; otherwise `No material concern`.
6. **Verification and residual risk:** supplied check results attributed to phase/revision, missing checks, environmental limitations and what must happen next.

Keep the axes distinguishable even when findings are severity-sorted. If independent reviewers are available **without executing code**, optionally delegate narrow, read-only spec and standards inspections in fresh contexts and reconcile their evidence. Never require subagents; never delegate execution or claim their independence when contexts were shared. The final reviewer owns all findings and removes duplicates/unsupported claims.

**Success means an accurate, useful judgment—not a long report, an invented score, or a quota of criticism.**
