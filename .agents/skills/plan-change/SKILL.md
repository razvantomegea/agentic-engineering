---
name: plan-change
description: >-
  Plan meaningful engineering changes using a human-centered, feature-oriented
  architecture: clear behavioral home, deep cohesive modules, minimum navigational
  complexity, explicit state ownership, and few necessary files. Use before
  nontrivial implementation or architectural changes.
---

# Plan Change — One Obvious Home for the Feature

Your job is to make the feature understandable and changeable by another human **without a repo-wide treasure hunt**. Optimize for minimum conceptual and navigational complexity, not minimal line count or maximal reuse. Do not implement during this stage.

## 1. Discover the actual system

- Locate the user's entry point, state owner, business decisions, side effects, dependencies, and current tests.
- Trace **one representative user action** through the current system, using only the necessary files. Differentiate observed code from assumptions.
- Identify where a teammate would currently look to change one important feature rule. If the answer spans many files, explain *why*.

## 2. Resolve choices and preserve the planning contract

Use the complexity level from `AGENTS.md` / `ship-change`. Skip formal planning for Level 0; keep Level 1 discussion brief.

Before drafting the plan, resolve material choices with the engineer in rounds. The **frontier** contains questions whose prerequisites are settled. Discover repository facts yourself; present the current frontier together with recommendations, wait for answers, then address dependent questions. Finish when no material choices remain open and the engineer confirms shared understanding.

- **Level 1:** keep decisions and their reasons inline in the plan's `DECISIONS` section.
- **Level 2–3:** record each round's questions, options, recommendation, human decisions and reasons in `docs/decisions/<YYYY-MM-DD>-<slug>.md` as they resolve. Maintain `GLOSSARY.md` for resolved domain terms, creating it lazily when needed. Record hard-to-reverse architectural tradeoffs in `docs/adr/`; Level 3 expects at least one ADR.
- Reuse the repository's existing glossary and decision/ADR locations. Link the records from the plan so review and handoff can recover the rationale without the chat.

For Level 2–3, verify the required records exist on disk and `OPEN QUESTIONS` is empty before requesting plan acceptance. Obtain acceptance before `implement-change` or `guided-implementation`; acceptance already given for the same direction counts.

## 3. Prefer one cohesive behavioral home

A meaningful feature should have **one obvious place to inspect for its central behavior and invariants**. Prefer an existing feature service/manager/module; when a class meaningfully groups behavior, lifecycle, or state, a framework-agnostic `FeatureManager` or `FeatureService` is a good default.

Preferred conceptual shape when the feature warrants separation:

`React component (presentation) -> thin hook/adapter (reactivity/lifecycle) -> feature manager/service (behavior/state transitions/orchestration) -> external APIs/infrastructure`

This is a **responsibility map**, not a mandate to create four files/layers. A small feature may reasonably live in one component or one hook. Do not wrap a single function in a class only to comply with this policy.

### Meaning of "single responsibility"

A cohesive service can own multiple methods, helpers, validations, state transitions and edge cases **for one feature or one reason to change**. Single responsibility does NOT mean one function per file, one class per operation, or a constellation of pure utility functions.

- Keep small pure calculations next to their feature when they are local implementation details, including as private functions/methods.
- Extract a separate module only for a **real independent reason to change**: substantive reusable domain knowledge, a separate subsystem, meaningful external boundary, or a file whose internal complexity genuinely impedes comprehension.
- Never automatically create `utils/`, `helpers/`, `factories/`, `strategies/`, `selectors/`, or forwarding service layers.
- Prefer composition over large god managers. A manager owns one cohesive feature; do not make it own unrelated business domains, all I/O, rendering, or application-wide state.
- Prefer an explicit, small public API. Internals and algorithms should remain private.

## 4. React/framework boundary

Domain logic should not depend on React where avoiding that dependency is straightforward. UI components render and emit intentions; hooks adapt the React lifecycle/state mechanism. **Do not duplicate the same mutable source of truth** in both a manager and a hook. For an external stateful manager, explicitly plan a supported subscription/invalidation mechanism (for example `useSyncExternalStore` with stable snapshots) and instance lifetime/cleanup. For simple local UI state, ordinary React state may be simpler than a manager.

## 5. Challenge design complexity

Answer:

1. **Behavioral home:** Which ONE module would I open first to understand or modify this feature?
2. **Human navigation:** Which other files are genuinely necessary to understand the normal flow? Can any be removed/merged?
3. **Public API:** What are the few operations a caller must understand?
4. **Ownership:** Who owns state, business rules, side effects, and failure handling?
5. **Change amplification:** Can a foreseeable requirement change be made mainly in one place?
6. **Tradeoff:** Is extracting a helper truly better than keeping a private pure function beside its caller?
7. **Scope:** Are we introducing a reusable abstraction without proven shared business meaning?
8. **Comprehension:** Could a teammate explain the feature after inspecting the owner and at most a few directly relevant files (where practical)?

## 6. Concise output

- Complexity level and goal/acceptance criteria
- **Before:** normal flow and current behavior owner (with actual file paths)
- **After:** normal flow and *single primary behavioral home* (with proposed paths)
- Public interface: small operations/inputs/outputs
- Proposed files: why each one must exist; explicitly mention removed/merged wrappers where applicable
- State ownership, invariants, errors and external boundary
- Verification plan and architectural risks
- `DECISIONS`: inline rationale for Level 1; links to decision records, glossary and applicable ADRs for Level 2–3
- `OPEN QUESTIONS`: unresolved choices or explicitly none; must be empty before Level 2–3 acceptance
- A **30-second explanation** of the architecture another engineer could give

If an alternative requires more layers/files, justify the additional concepts with concrete benefits. Don't invent a layer count quota, and don't document imaginary future extensibility.
