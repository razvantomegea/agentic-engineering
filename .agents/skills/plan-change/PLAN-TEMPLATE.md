# Implementation plan template

Use every relevant section below. Replace prompts with concrete repository-grounded content; do not deliver an empty template. Mark inapplicable sections with a reason. A small change can have short sections; a complex change needs enough detail to remove implementation guesswork.

Planning and plan review are documentation-only (see `AGENTS.md` Phase boundary / `SKILL.md`). Snippets, commands, and tests here are inert instructions for later implementation/verification — not actions to run while drafting or reviewing.

## Contents

1. Identity and outcome
2. Requirements and scope
3. Current-system story
4. Decisions and interview record
5. Proposed-system story
6. File and symbol map
7. Contracts, state, and code samples
8. Ordered implementation steps
9. Verification and acceptance matrix
10. Rollout, recovery, and risks
11. Readiness and handoff

## 1. Identity and outcome

- Title, complexity level, status (DRAFT / BLOCKED / READY / ACCEPTED), and plan revision.
- Repository baseline: branch/commit inspected, relevant working-tree changes, and date.
- Problem, affected actor, concrete trigger, desired result, and why the change is needed.
- A short architecture overview, followed by the detailed story below.

READY means complete and reviewed as required; ACCEPTED additionally records the engineer's acceptance or applicable prior authorization. Do not equate the two.

## 2. Requirements and scope

Assign stable requirement IDs (R-01, etc.). For each, state the exact behavior and observable acceptance criteria, including representative inputs/outputs. Separate functional requirements, constraints, non-goals, and behavior that must be preserved. List assumptions with evidence or explicit delegation; unresolved material assumptions belong in OPEN QUESTIONS.

## 3. Current-system story — what happens today

Tell the story of a concrete action from entry point to final outcome. At each meaningful hop name the repository-relative path, symbol, responsibility, input/output, state change, and side effect. Explain why the existing behavior fails to meet the requirement. Include relevant existing failure behavior and tests.

Distinguish observed facts from inferred explanations. Cite inspected code; do not invent historical intent. Identify the primary behavioral home and the minimum other files a reader needs.

## 4. DECISIONS and interview record

For each D-01-style decision, record linked question IDs, viable alternatives, choice, rationale, tradeoffs, and affected requirements/steps. State whether it is user-confirmed, explicitly delegated, or a repository constraint. Link the decision log, applicable glossary entries, and ADRs. Keep enough rationale here to understand the implementation without reading chat history.

### OPEN QUESTIONS

List unresolved user choices and technical investigations, their impact, prerequisites, and how each will be resolved. Use 'None' only when actually empty. Do not defer required decisions to the implementer or hide them in risk notes.

## 5. Proposed-system story — what happens after the change

Walk through the same example as section 3 with concrete values. Explain the sequence as connected prose:

1. Who triggers the operation, from which entry point, and with what inputs.
2. Which caller invokes which feature operation and why that module owns it.
3. How validation and business rules select a branch; which invariants each branch preserves.
4. When state changes and side effects run, and in what order.
5. How results propagate to callers, UI, storage, or other consumers.
6. What the user/system observes at completion.

Add separate failure, cancellation, retry, and concurrency stories where applicable. Include intermediate state and exact recovery behavior. A flow diagram may supplement the prose but must not replace file/symbol references or decision logic.

## 6. File and symbol map — where to edit

| Path | Existing/new/move/delete | Symbol or insertion anchor | Exact change | Why here | Requirements / steps |
|---|---|---|---|---|---|

Use actual repository-relative paths. For moves, name both paths and affected imports/callers. For new files, explain why extending the current owner is insufficient. Name the primary behavioral home, its public interface, and each supporting file's responsibility. Identify obsolete code to remove and compatibility-sensitive code to preserve. Avoid uncertain paths such as 'somewhere under services'.

## 7. Contracts, state, and code samples — how it works

Document applicable details:

- Public types/signatures, input validation, defaults, nullability, units, output/error variants, and caller handling.
- State owner, source of truth, derived values, initial state, allowed transitions, lifecycle, subscriptions, and cleanup.
- Business-rule order, invariants, external contracts, side-effect boundaries, concurrency and idempotency rules.
- Persistence constraints, authorization checks, compatibility, and dependency/configuration changes.

Include destination-labeled code blocks for contracts, central logic, caller integration, and important verification examples. Use the repository's language and conventions. Show enough surrounding context (imports, signature, caller) to make placement and wiring unambiguous. Explain why each sample belongs there and how its output feeds the next step.

Label each block **exact proposed code (execution status)** or **illustrative pseudocode**. Verify referenced existing symbols/APIs; label proposed ones as new. Specify all consequential branches even in pseudocode. Do not use TODOs or ellipses for material behavior. Boilerplate can be omitted only with an explicit boundary and placement instruction. For documentation/configuration changes, show exact replacement text or configuration instead of inventing application code.

Example of the expected specificity (illustrative only; paths and APIs must be replaced with verified ones):

> In proposed `src/features/search/SearchManager.ts`, `search(query)` owns request ordering. Each invocation increments a sequence before awaiting the injected search client. Both success and failure handlers compare their captured sequence to the current sequence. Superseded requests must not overwrite newer results or publish errors. The caller reads the owner's snapshot through the existing subscription adapter. This keeps ordering decisions in the feature owner rather than the view.

```ts
// Illustrative pseudocode for SearchManager.search; not executed.
async search(query: string): Promise<void> {
  const sequence = ++this.sequence;
  this.publish({ status: 'loading', query, results: [], error: null });
  try {
    const results = await this.client.search(query);
    if (sequence !== this.sequence) return;
    this.publish({ status: 'success', query, results, error: null });
  } catch {
    if (sequence !== this.sequence) return;
    this.publish({ status: 'error', query, results: [], error: 'Search failed' });
  }
}
```

This excerpt illustrates one rule, not a complete feature plan. A real plan must also define the client contract, snapshot type, `publish`, subscription behavior, instance lifetime/disposal, input rules, and the exact call site. Do not copy this design unless the target system needs it.

## 8. Ordered implementation steps — what to do next

Repeat this step structure for S-01, S-02, etc., ordered by actual dependencies:

- **Purpose and traceability:** requirement/decision IDs and why this step exists.
- **Prerequisites:** earlier step IDs, known baseline, required configuration or data. State 'none' where true.
- **Files and symbols:** exact paths, edit locations, callers, and imports affected.
- **Edits and logic:** explicit operations in execution order, including important branches, state transitions, error behavior, and cleanup. Include code samples here or point to exact samples in section 7.
- **Preserve:** behavior/contracts that must not change during this step.
- **Verification:** exact command with working directory, setup/fixture, expected result, and negative/regression case. If manual, give exact actions and observations.
- **Completion evidence:** what must be true before marking this step done and beginning dependent work.

No steps such as 'implement the service', 'wire up UI', or 'add tests' without the actual rules, integration points, and assertions. Split steps that require unrelated decisions. Do not require new automated tests for every mechanical edit; use the smallest meaningful check.

## 9. Verification and acceptance matrix

| Requirement / invariant | Scenario and fixture | Expected result | Test path / symbol or manual procedure | Command and working directory | Step |
|---|---|---|---|---|---|

Cover the normal path, meaningful boundary/failure cases, applicable race/lifecycle cases, and preserved behavior. Specify test doubles versus real integration boundaries. Give concrete assertions, not 'works correctly'. List setup/environment requirements without secrets. Verify commands against repository scripts/tooling; label newly proposed scripts as new and include their implementation step.

Separate existing execution evidence supplied by other phases from future checks. Attribute evidence to its source and revision. Record unavailable infrastructure and what it prevents verifying. Planning/review run no checks; planned tests and unexecuted examples are not passing evidence. A required unknown that needs execution keeps the plan BLOCKED until the separate implementation/verification phase supplies evidence.

## 10. Rollout, recovery, and risks

When applicable, specify compatibility/deployment order, migration/backfill steps, feature flags, health signals, success/abort thresholds, rollback procedure, and data recovery. Explain irreversible effects and residual risks. For a local reversible change, state why no special rollout is needed. Do not add infrastructure or flags just to fill this section.

## 11. Readiness and handoff

- Confirm all material questions and required review findings are resolved.
- Confirm paths, symbols, snippets, contracts, narrative, and verification are consistent.
- Link required records on disk and name the exact plan revision reviewed/accepted.
- Record plan-review result separately from implementation verification and human acceptance.
- Give the implementer a start point: first step, required reading, ordered steps, verification entry point, and conditions requiring replanning.
- If blocked, identify the missing evidence/decision and the next discovery/question action; do not label the plan READY.

The implementer may choose routine syntax and mechanical details. They must not invent missing product behavior, public contracts, state ownership, failure policy, or rollout decisions.
