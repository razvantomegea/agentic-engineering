---
name: implement-change
description: Implement software changes in any programming language with one obvious behavioral home, cohesive modules where useful, minimal indirection, and verified behavior. Use during implementation, not planning-only or review-only work.
---

# Implement Change — Write for Human Navigability

Your job is to produce correct, verifiable software that a human can understand and maintain **without tracing a long chain of helpers**. Follow the agreed design or explain why evidence requires a change.

## Caveman mode for implementation updates

Use [Caveman](https://github.com/JuliusBrussee/caveman) style for routine implementation updates and the final verification summary. Lead with the change, finding, or result. Use short, direct sentences and cut filler and repeated context. Keep commands, paths, error messages, and check results exact. Use full sentences when explaining design decisions, risks, or anything the engineer needs to understand before merging. Apply this style only to implementation communication. Write code, comments, and documentation in the repository’s usual style.

## Implementation loop

For planned work, read the accepted plan and linked decisions from disk before editing; do not implement from a chat summary alone. Check its baseline against current files, then confirm exact edit locations, contracts, sample logic, dependencies, and acceptance checks are present. For Level 2–3, confirm the required plan review and acceptance are recorded. Trivial work retains its direct implement/verify path.

Execute the numbered steps in dependency order, using their code samples and completion evidence. Track completed steps and actual checks in the plan. Treat illustrative pseudocode as a behavior contract to adapt to verified APIs, not paste-ready code. Verify exact proposed samples against the current repository too; a plan is not proof that code runs.

If a required behavior, public contract, state owner, error policy, or rollout decision is missing, or the repository contradicts the plan, stop the affected step and return the precise gap to `plan-change`. Continue independent safe work where possible. Update affected plan sections and obtain any required review/acceptance for material changes; existing authorization counts, and routine syntax/mechanical edits need no new approval. Never silently fill design gaps or follow stale samples against contrary evidence.

Work in **small coherent increments**: implement one meaningful change -> verify/observe -> update shared understanding when needed -> continue.

- Verify important behavior as soon as practical, rather than saving all feedback for the end.
- Explain non-obvious decisions and material changes to behavior, state ownership, flow, boundaries or invariants when they occur. If evidence changes the design or implementation outruns understanding, update the shared mental model before continuing.
- Keep updates brief. Do not require permission for routine edits, narrate mechanical work, or turn each increment into a tutorial.

## 1. One place to read the feature

- Keep related business rules, state transitions, validation, orchestration, and feature-specific failure handling together in the same cohesive feature owner where practical.
- In a complex feature, a cohesive module, function group, class, or service with a small public API is welcome when it provides meaningful state, lifecycle, transactions, or orchestration.
- Do not force a class for simple transformations or trivial behavior. Choose the **fewest concepts** that make the behavior obvious in the project's language and style.
- Keep small pure functions co-located as private helpers. Purity is valuable; unnecessary extraction into new files is not.
- Do not scatter the feature into `FeatureService -> FeatureHelper -> FeatureUtils -> FeatureStrategy` unless each boundary hides independent meaningful complexity.
- Do not create a pass-through adapter or service solely to preserve a theoretical layer. Each boundary should handle a real concern such as transport, lifecycle, persistence, or presentation.
- Avoid "god managers": different domain capabilities that change for different reasons belong behind separate cohesive owners.

## 2. Framework integration, when applicable

- Keep framework adapters focused on their actual role, whether UI rendering, request handling, command parsing, scheduling, or lifecycle. Keep substantial feature decisions in the feature owner when that improves clarity.
- Choose an explicit lifetime and update mechanism for stateful owners. Have a single source of truth; avoid mirroring mutable state across layers without a synchronization design.
- Keep external APIs and storage at a sensible boundary or inject a narrow dependency where it genuinely helps testing; do not build a dependency-injection framework.
- In React specifically, hooks may own UI-only state and lifecycle. A stateful external owner needs a reliable subscription, stable snapshot/update strategy, and cleanup; mutating a class field alone does not trigger rendering.

## 3. Minimum complexity; practical DRY

- Prefer straightforward branching, names and explicit contracts to clever terseness.
- DRY **business knowledge/invariants** rather than syntactically similar snippets. Small local duplication can be preferable to a shared abstraction that couples independent features.
- Avoid speculative factories, interfaces, base classes, generic pipelines, deep inheritance, excessive callbacks, wrapper files, redundant state, config engines and incidental refactors.
- Keep related behavior in one file until a real readability, independent responsibility, or meaningful dependency boundary calls for a split. File length alone is not a reason to split.
- Every new file/abstraction must repay the *navigation cost* it imposes.
- Prefer removing obsolete layers and dead code when safe.

## 4. Mandatory self-review: human comprehension

Before saying done, inspect the actual diff and answer:

1. If a teammate asks "where does this feature logic live?", is the answer a single clear file/module?
2. Can the typical action be understood through a compact path from entry point to feature owner to external boundary?
3. Did I split related business logic into unnecessary helper files or adapters?
4. Does each extracted class/module have a genuine independent responsibility, or is it a forwarding layer?
5. Is the state owner explicit? Do callers observe its changes correctly in the chosen language and framework?
6. Would changing one business rule force coordinated edits across many locations?
7. Can we remove a file, abstraction, option, state variable or indirection without harming clarity or tests?
8. Did I make a manager so broad that it now owns unrelated capabilities?
9. Did I preserve repo conventions and avoid unrelated edits?

Simplify if a concrete problem exists; do not churn for aesthetics.

## 5. Verify and hand off

Run relevant type checks, lint, tests, build and integration/E2E verification; report **exactly** which passed or were not run. Test behavior and important invariants through the feature's public API where practical, not every private helper.

End with:
- Primary behavioral home (file path)
- The normal flow in one line
- Other files changed, each with its reason to exist
- Tests/checks run + remaining risks

Keep shared understanding current throughout implementation. The `engineering-handoff` skill consolidates that understanding and checks ownership after review; it is not the first explanation of important decisions.
