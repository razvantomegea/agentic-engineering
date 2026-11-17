# Implementation plan template

A plan has two parts. **Part A — Why** lets the engineer and the reviewer understand and challenge the change. **Part B — Do** is the execution spec: the implementer reads Part B, Part A §1, and the IDs Part B cites, and decides nothing beyond syntax. Fill every relevant section with repository-grounded content; mark an inapplicable section with a one-line reason. A small change gets short sections, not missing ones.

Planning and plan review are documentation-only (see [SKILL.md](SKILL.md)). Code, commands, and tests in a plan are inert text for later phases.

## Writing rules

- **State each fact once.** Give it an ID — requirement `R-01`, decision `D-01`, contract `C-01`, step `S-01` — and cite the ID elsewhere instead of restating it.
- **Ground every reference.** Name each existing path, symbol, command, and config key as inspected at the baseline. For a third-party API, cite the package, its installed version (lockfile or manifest), and where you read the signature (the installed type definitions or that version's docs). Mark everything new as `new`. A fact you could not verify is an OPEN QUESTION, or a preflight check (§5) when only execution can settle it and the plan states what happens if it fails; if the design depends on it, the plan is BLOCKED. Never a silent assumption.
- **Exact where it binds.** Contracts (§4) and anchors (§5) are exact. A function body may be pseudocode that lists every branch, value, and failure outcome. No TODOs, ellipses, or "handle errors" in material behavior.
- **UI with a design reference** (mockup, screenshot, brand): also follow [UI-SPEC.md](UI-SPEC.md).

## Header

Title · level · status (DRAFT / BLOCKED / READY / ACCEPTED) · revision · baseline (branch, commit, relevant uncommitted changes, date) · links to the decision log, glossary entries, and ADRs. READY means complete and plan-reviewed; ACCEPTED also records the engineer's acceptance of a named revision.

# Part A — Why

## 1. Outcome, scope, and risks

- Problem, affected actor, trigger, and desired result in two to four sentences.
- Requirements `R-01…`: exact behavior with observable acceptance criteria and a representative input → output.
- **Preserve:** behavior and contracts that must not change.
- Non-goals, and the constraints the change touches (security, data, compatibility, performance, cost).
- Risks and rollout: irreversible effects, deployment order, migration or backfill, flags, rollback and data recovery, residual risk. For a local reversible change, one line saying why none is needed. Rollout actions are steps in §6.

## 2. Before → after

One concrete example, traced twice with real values.

- **Before:** entry point → each meaningful hop (`path#symbol`, responsibility, state change, side effect) → outcome, and why it fails the requirement. Separate observed code from inference.
- **After:** the same example through the new flow: who calls which operation, which rule selects the branch, when state changes and side effects run, and what the user or system observes.
- **Failure paths:** one short trace per material failure, cancellation, retry, or concurrency case, with exact recovery behavior.
- **Behavioral home:** the one module to open first, its public operations, and the few other files a reader needs.

A diagram may supplement the traces; it never replaces paths and symbols.

## 3. Decisions

Per decision `D-01…`: question IDs, viable alternatives, choice, rationale, tradeoff, affected `R`/`S` IDs, and provenance (user-confirmed, delegated, or repository constraint). For L2–L3, link the decision log.

### OPEN QUESTIONS

Unresolved user choices and investigations, with impact and how each will be resolved. Write `None` only when empty. Nothing is deferred to the implementer.

## 4. Contracts

Per contract `C-01…`, exact text in the repository's language and conventions, labeled with its destination path:

- New or changed public signatures, types, schemas, request/response and error shapes, events, config keys, and exact documentation or configuration text.
- State: owner, source of truth, initial value, allowed transitions, lifetime, observation, and cleanup.
- Rule order, invariants, idempotency and concurrency rules, authorization, persistence and compatibility constraints.

# Part B — Do

## 5. Baseline and preflight

The implementer runs these before the first edit; any failure is a stop condition (§8).

- **Baseline:** the branch and commit the plan was written against.
- **Anchors:** for each edit in §6, the file and an anchor — a symbol, or a short snippet copied verbatim from the baseline file — that must match exactly once, with a fixed-string count check, for example `git grep --no-index -F -c -e '<anchor>' -- <path>` → `<path>:1`. Single-quote the anchor so backticks and `$` stay literal.
- **Commands:** each verification command exists in the repository's scripts or tooling.
- **Dependencies:** each existing third-party API the plan uses, with its expected installed version; each package the plan adds, with its pinned version and the step that adds it.
- **Pre-existing failures:** run the §7 commands once and record what already fails, so new failures are attributable.

## 6. Steps

Ordered by real dependencies. Per step:

| Field | Content |
|---|---|
| `S-01 · R/D/C IDs` | Purpose in one line |
| Prerequisites | Earlier step IDs, data, or configuration; `none` when true |
| File | Path, and new / edit / move / delete |
| Anchor | From §5, or `new file` |
| Operation | Insert before/after, replace, delete, or create |
| Edit | Exact code or text, a `C-` reference, or branch-complete pseudocode |
| Preserve | What this step must not change |
| Check | Exact command and working directory, or manual actions → expected result, including one negative or regression case |

No step such as "implement the service", "wire up the UI", or "add tests" without the actual rules, call sites, and assertions. Split steps that need unrelated decisions. The smallest meaningful check per step is enough; not every mechanical edit needs a new test.

## 7. Verification matrix

| R / invariant | Scenario and fixture | Expected | Test path or manual procedure | Command (cwd) | Step |
|---|---|---|---|---|---|

Cover the normal path, meaningful boundary and failure cases, applicable race or lifecycle cases, and preserved behavior. Use concrete assertions, not "works correctly". Say which boundaries are real and which are test doubles. Planned checks are not evidence; record execution evidence from other phases with its source and revision.

## 8. Stop conditions

The implementer stops and returns to planning when:

- an anchor matches zero or several times, or the baseline moved under a touched file;
- a cited symbol, command, or existing dependency version differs from the plan;
- a step needs a product, contract, ownership, failure-policy, or rollout decision the plan does not make;
- a check fails for a reason the plan did not anticipate and the cause is not a local slip.

Routine syntax and mechanical details are the implementer's call. Record any deviation against its step ID.

## Example step (illustrative; replace with verified paths)

> **S-03 · R-02, D-01, C-02** — round each cart line before summing.
> Prerequisites: S-02. File: `src/cart/pricing.ts` (edit). Anchor: `export function totalFor(` → 1 match. Operation: replace the function body; signature per C-02.
> Edit (branch-complete pseudocode): empty cart → `0`; each line → `qty * unitPrice` rounded to cents (D-02); sum the lines; apply the D-03 discount after summing; a negative result → `0`.
> Preserve: the `totalFor` signature and its callers in `src/cart/CartView.tsx`.
> Check: `npm test -- pricing` from the repository root → passes, including the new case "two lines of 0.333 total 0.66, not 0.67".
