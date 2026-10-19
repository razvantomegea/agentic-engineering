---
name: implement-change
description: Implement React/TypeScript or framework-agnostic features with one obvious behavioral home, cohesive manager/service where useful, thin UI adapters, local private pure functions, minimal indirection, and verified behavior. Use during implementation, not planning-only or review-only work.
---

# Implement Change — Write for Human Navigability

Your job is to produce correct, verifiable software that a human can understand and maintain **without tracing a long chain of helpers**. Follow the agreed design or explain why evidence requires a change.

## Implementation loop

Work in **small coherent increments**: implement one meaningful change -> verify/observe -> update shared understanding when needed -> continue.

- Verify important behavior as soon as practical, rather than saving all feedback for the end.
- Explain non-obvious decisions and material changes to behavior, state ownership, flow, boundaries or invariants when they occur. If evidence changes the design or implementation outruns understanding, update the shared mental model before continuing.
- Keep updates brief. Do not require permission for routine edits, narrate mechanical work, or turn each increment into a tutorial.

## 1. One place to read the feature

- Keep related business rules, state transitions, validation, orchestration, and feature-specific failure handling together in the same cohesive feature owner where practical.
- In a complex feature, a framework-agnostic class/manager/service with a small public API is welcome, especially when it provides meaningful state, lifecycle, transactions, or orchestration.
- Do not force a class for simple transformations, basic forms, or trivial UI behavior. Choose the **fewest concepts** that make the behavior obvious.
- Keep small pure functions co-located as private helpers. Purity is valuable; unnecessary extraction into new files is not.
- Do not scatter the feature into `FeatureService -> FeatureHelper -> FeatureUtils -> FeatureStrategy` unless each boundary hides independent meaningful complexity.
- Do not create a pass-through hook/service solely to preserve a theoretical layer. React hooks/adapters must actually bridge React lifecycle, reactivity, or UI concerns.
- Avoid "god managers": different domain capabilities that change for different reasons belong behind separate cohesive owners.

## 2. React integration rules

- UI components should primarily render and handle interaction; keep substantial feature decisions out of JSX and `useEffect` chains.
- Hooks may own **UI-only React state and lifecycle**; services/managers own feature behavior. For simple features, a cohesive custom hook may own both without introducing a service.
- For a stateful manager, choose an explicit instance lifetime, subscription mechanism, stable snapshot/update strategy, and cleanup. Do not expect mutating a class field to trigger React rendering automatically.
- Have a single source of truth; avoid mirroring manager state to React state unless necessary and synchronized by design.
- Hide HTTP/storage/browser APIs at a sensible boundary or inject a narrow dependency where it genuinely helps testing; do not build a dependency-injection framework.

## 3. Minimum complexity; practical DRY

- Prefer straightforward branching, names and types to clever terseness.
- DRY **business knowledge/invariants** rather than syntactically similar snippets. Duplicated JSX or small local helpers can be preferable to a shared abstraction that couples independent features.
- Avoid speculative factories, interfaces, base classes, generic pipelines, deep inheritance, excessive callbacks, wrapper files, redundant state, config engines and incidental refactors.
- Keep related behavior in one file until a real readability, independent responsibility, or meaningful dependency boundary calls for a split. File length alone is not a reason to split.
- Every new file/abstraction must repay the *navigation cost* it imposes.
- Prefer removing obsolete layers and dead code when safe.

## 4. Mandatory self-review: human comprehension

Before saying done, inspect the actual diff and answer:

1. If a teammate asks "where does this feature logic live?", is the answer a single clear file/module?
2. Can the typical action be understood through a compact path such as UI -> adapter -> manager -> API?
3. Did I split related business logic into unnecessary pure-function files, selectors or hooks?
4. Does each extracted class/module have a genuine independent responsibility, or is it a forwarding layer?
5. Is the state owner explicit? Does React update correctly after manager state changes?
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
